defmodule Danton.RoomChannel do
  use Danton.Web, :channel

  intercept(["new_msg"])

  # TODO: add authorization
  def join("room:" <> _room_id, _params, socket) do
    {:ok, socket}
  end

  def handle_in("new_msg", %{"body" => body, "post_id" => post_id, "user_id" => user_id}, socket) do
    room = Room.for_post(Room, post_id) |> Repo.one

    message = Message.create_message_for_room(room, %{body: body, user_id: user_id})
      |> Repo.preload(:user)

    message_json = Danton.Api.V1.MessageView.render(
      "message.json",
      %{message: message}
    )

    broadcast! socket, "new_msg", message_json

    {:noreply, socket}
  end

  def handle_out("new_msg", payload, socket) do
    push socket, "new_msg", payload
    {:noreply, socket}
  end
end
