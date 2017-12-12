alias Danton.Email
alias Danton.Push
alias Danton.Mailer
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
    case type_for_user(user, type, params) do
      :immediate -> send_notification(user, type, params)
      :batch -> make_pending_notification(user, type, params)
      :none -> no_send
    end
  end

  defp type_for_user(user, _type, _params) do
    # immediate, batch, none
    :batch
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
      type: inspect(type),
      data: params,
      status: "pending"
    ) |> Repo.insert()
  end

  # ===========
  # NOT SENDING
  # ===========

  defp no_send, do: {:ok, :not_sent}
end
