alias Danton.Email
alias Danton.Push
alias Danton.Mailer
alias Danton.Post
alias Danton.Message
alias Danton.Repo
alias Danton.User
alias Danton.UserToken

# TODO: think about how to split this up sanely
# this is definitely not the right set up

# each user should get their own process

defmodule Danton.Communication do
  # =============================
  # BATCH OR SEND OR IGNORE LOGIC
  # =============================

  def notify_users(user_ids, type, params) do
    users = user_ids |> User.for_ids() |> Repo.all()

    Enum.each(
      users,
      &(notify(&1, type, params))
    )
  end

  def notify_user(user_id, type, params) do
    notify_users([user_id], type, params)
  end

  def notify(user, type, params) do
    case notification_timeframe(user, type, params) do
      :immediate -> send_notification(user, type, params)
      :batch -> make_pending_notification(user, type, params)
      :none -> no_send
    end
  end

  defp notification_timeframe(user, type, params) do
    # immediate, batch, none
    timeframe(type).get(user, params)
  end

  defp timeframe(type) do
    case type do
      :new_chat_message -> Danton.Timeframe.NewChatMessage
      :new_post -> Danton.Timeframe.NewPost
      _ -> Danton.Timeframe.Default
    end
  end

  # ===========
  # SENDING NOW
  # ===========

  def send_notification(user_id, type, params) when is_number(user_id) do
    user = Repo.get(User, user_id)
    send_notification(user, type, params)
  end

  def send_notification(user = %Danton.User{}, type, params) do
    push_tokens = UserToken.for_user(user.id) |> Repo.all()

    if List.first(push_tokens) do
      Enum.each(
        push_tokens,
        &(apply(Push, type, [&1.value, params]))
      )
    else
      notify_via_email(user, type, params)
    end
  end

  def notify_via_email(user, type, params) do
    apply(Email, type, [user, params]) |> Mailer.deliver_later
  end

  # =============
  # SENDING LATER
  # =============

  defp make_pending_notification(user, type, params) do
    Ecto.build_assoc(
      user, :notifications,
      type: Atom.to_string(type),
      data: params,
      status: "pending"
    ) |> Repo.insert()
  end

  # ===========
  # NOT SENDING
  # ===========

  defp no_send, do: {:ok, :not_sent}
end

# MESSAGE TIMEFRAME

defmodule Danton.Timeframe.NewChatMessage do
  def get(user, params) do
    if user_in_discussion(user, params) do
      :immediate
    else
      Danton.Timeframe.Default.get(user, params)
    end
  end

  defp user_in_discussion(user, params = %{:post_id => post_id}) do
    Post.user_is_owner(post_id, user.id) || Message.user_in_discussion(post_id, user.id)
  end
end

defmodule Danton.Timeframe.NewPost do
  def get(user, params) do
    Danton.Timeframe.Default.get(user, params)
  end
end

defmodule Danton.Timeframe.Default do
  def get(user, params) do
    :batch
  end
end