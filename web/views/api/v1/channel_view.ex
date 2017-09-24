defmodule Danton.Api.V1.ChannelView do
  use Danton.Web, :view

  def render("index.json", %{channels: channels}) do
    %{data: render_many(channels, Danton.Api.V1.ChannelView, "channel.json")}
  end

  def render("show.json", %{channel: channel}) do
    %{data: render_one(channel, Danton.Api.V1.ChannelView, "channel.json")}
  end

  def render("channel.json", %{channel: channel}) do
    %{
      id: channel.id,
      name: channel.name,
      description: channel.description,
      club_id: channel.club_id
    }
  end
end
