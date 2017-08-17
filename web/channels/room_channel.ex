defmodule Danton.RoomChannel do
  use Phoenix.Channel
  intercept(["new_msg"])

  def join("room:" <> _room_id, _params, socket) do
    # TODO: add authorization
    {:ok, socket}
  end

  def handle_in("new_msg", %{"body" => body, "post_id" => post_id}, socket) do
    room = Danton.Post.get_room(post_id)
    message = Danton.Room.make_message(room, %{body: body})
    message_json = Danton.Api.V1.MessageView.render("message.json", %{message: message})

    broadcast! socket, "new_msg", message_json

    {:noreply, socket}
  end

  def handle_out("new_msg", payload, socket) do
    push socket, "new_msg", payload
    {:noreply, socket}
  end
end
