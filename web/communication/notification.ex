alias Danton.Email
alias Danton.Mailer
alias Danton.Repo
alias Danton.User

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

  def notify(user, type, params) do
    apply(Email, type, [user, params]) |> Mailer.deliver_later
  end
end
