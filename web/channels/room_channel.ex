defmodule Danton.RoomChannel do
  use Phoenix.Channel
  intercept(["new_msg"])

  def join("room:" <> _room_id, _params, socket) do
    # TODO: add authorization
    {:ok, socket}
  end

  def handle_in("new_msg", %{"body" => body}, socket) do
    broadcast! socket, "new_msg", %{body: body}
    {:noreply, socket}
  end

  def handle_out("new_msg", payload, socket) do
    push socket, "new_msg", payload
    {:noreply, socket}
  end
end
