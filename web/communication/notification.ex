alias Danton.Email
alias Danton.Push
alias Danton.Mailer
alias Danton.Repo
alias Danton.User
alias Danton.UserToken

# TODO: think about how to split this up sanely
# this is definitely not the right set up

# the message construction should exist on its own
# the delivery should exist on its own

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

  # Presumably this picks the message medium
  # but is hardcoding to email right now
  def notify(user, type, params) do
    push_token = UserToken.first_for_user(user.id)

    if push_token do
      apply(Push, type, [push_token.value, params])
    else
      apply(Email, type, [user, params]) |> Mailer.deliver_later
    end
  end
end
