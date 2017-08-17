defmodule Danton.RoomChannel do
  use Phoenix.Channel
  intercept(["new_message"])

  def join("room:" <> _room_id, _params, socket) do
    # TODO: add authorization
    {:ok, socket}
  end

  def handle_in("new_message", %{"body" => body, "post_id" => post_id, "user_id" => user_id}, socket) do
    room = Danton.Post.get_room(post_id)
    message = Danton.Room.make_message(room, %{body: body, user_id: user_id})
    message_json = Danton.Api.V1.MessageView.render("message.json", %{message: message})

    broadcast! socket, "new_message", message_json

    {:noreply, socket}
  end

  def handle_out("new_message", payload, socket) do
    push socket, "new_message", payload
    {:noreply, socket}
  end
end
