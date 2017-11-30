defmodule Danton.ChannelView do
  use Danton.Web, :view

  # for channel list
  def post_count_string(channel) do
    case channel.post_count do
      1 -> Integer.to_string(channel.post_count) <> " post"
      _ -> Integer.to_string(channel.post_count) <> " posts"
    end
  end

  def relative_time(time) do
    Timex.from_now time
  end
end
