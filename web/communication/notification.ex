alias Danton.Email
alias Danton.Push
alias Danton.Mailer
alias Danton.Repo
alias Danton.User
alias Danton.UserToken

# TODO: think about how to split this up sanely
# this is definitely not the right set up

# each user should get their own process

defmodule Danton.Notification do
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
end
