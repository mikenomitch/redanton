defmodule Danton.PostView do
  use Danton.Web, :view

  # def render_stream(posts) do
  #   render(Danton.PostView, "stream.html", posts: posts)
  # end

  def user_can_edit(post, current_user) do
    post.user_id == current_user.id
  end

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

  def show_pager(total_pages) do
    total_pages > 1
  end

  def show_prev(current_page) do
    current_page > 1
  end

  def show_next(current_page, total_pages) do
    current_page < total_pages
  end

  def prev_link(current_page) do
    "/front?page=" <> Integer.to_string (current_page - 1)
  end

  def next_link(current_page) do
    "/front?page=" <> Integer.to_string (current_page + 1)
  end

  # helpers for show
  def msg_class(message, current_user_id) do
    if (message.user_id == current_user_id) do
      "message-current-user"
    else
      "message-other-user"
    end
  end

  def posted_text(post) do
    post.user && post.user.name <> " posted to "
  end

  def latest_activity_text(post) do
    time = Post.latest_activity_time(post)
    activity_type = Post.latest_activity_type(post)
    if activity_type == :post do
      "Posted " <> Timex.from_now(time)
    else
      msg = Message.latest_for_post(post) |> Danton.Repo.preload(:user)
      "Message from " <> msg.user.name <> " " <> Timex.from_now(time)
    end
  end

  # helpers for form
  def dropdown_text(channel, clubs) do
    club = Enum.find(clubs, &(&1.id == channel.club_id))
    channel.name <> " (" <> club.name <> ")"
  end
end
