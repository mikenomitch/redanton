defmodule Danton.PostView do
  use Danton.Web, :view

  # def render_stream(posts) do
  #   render(Danton.PostView, "stream.html", posts: posts)
  # end

  # helpers for show
  def msg_class(message, current_user_id) do
    if (message.user_id == current_user_id) do
      "text-right"
    else
      ""
    end
  end
end
