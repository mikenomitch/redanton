# TODO: think about how to split this up sanely
# this is definitely not the right set up

# the message construction should exist on its own
# the delivery should exist on its own
import Ecto.Query, only: [from: 2]

defmodule Danton.Notification do
  def notify(user, message) do
    Danton.Email.new_chat_message(user, message) |> Danton.Mailer.deliver_later
  end

  def notify_users(user_ids, %{type: type, value: message}) do
    # TODO: Move into the user model
    users = from(u in Danton.User, where: u.id in ^user_ids) |> Danton.Repo.all
    message = make_notificaiton(type, message)
    Enum.each(users, &(notify(&1, message)))
  end

  def make_notificaiton(type, _info) do
    %{
      new_chat_message: "A new message is waiting"
    }[type]
  end
end