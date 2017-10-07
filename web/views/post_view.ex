defmodule Danton.PostView do
  use Danton.Web, :view

  # def render_stream(posts) do
  #   render(Danton.PostView, "stream.html", posts: posts)
  # end

  # helpers for stream
  def parse_link(post) do
    if (post.url && String.length(post.url) > 0) do
      has_scheme = String.contains? post.url, "http"
      if (has_scheme) do
        post.url
      else
        "http://#{post.url}"
      end
    else
      "/posts/#{post.id}"
    end
  end

  # helpers for show
  def msg_class(message, current_user_id) do
    if (message.user_id == current_user_id) do
      "message-current-user"
    else
      "message-other-user"
    end
  end
end
