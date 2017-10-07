defmodule Danton.Api.V1.MessageView do
  use Danton.Web, :view

  def render("index.json", %{messages: messages}) do
    %{data: render_many(messages, Danton.Api.V1.MessageView, "message.json")}
  end

  def render("show.json", %{message: message}) do
    %{data: render_one(message, Danton.Api.V1.MessageView, "message.json")}
  end

  def render("message.json", %{message: message}) do
    %{
      id: message.id,
      body: message.body,
      inserted_at: message.inserted_at,
      room_id: message.room_id,
      user_id: message.user_id,
      user_name: message.user.name
    }
  end
end
