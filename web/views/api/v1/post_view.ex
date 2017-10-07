defmodule Danton.Api.V1.PostView do
  use Danton.Web, :view

  def render("index.json", %{posts: posts}) do
    %{data: render_many(posts, Danton.Api.V1.PostView, "post.json")}
  end

  def render("show.json", %{post: post}) do
    %{data: render_one(post, Danton.Api.V1.PostView, "post.json")}
  end

  def render("post.json", %{post: post}) do
    room_id = Room.id_for_post(post.id)
    message = Message.latest_for_post(post)
    message_count = Message.count_for_post(post)

    %{
      id: post.id,
      title: post.title,
      description: post.description,
      url: post.url,
      type: post.type,
      user_id: post.user_id,
      channel_id: post.channel_id,
      room_id: room_id,
      message_count: message_count,
      last_activity_time: message && message.inserted_at || post.updated_at,
      last_message: message && %{
        body: message.body,
        user_id: message.user_id
      }
    }
  end

  # helpers for show
  def msg_class(message, current_user_id) do
    if (message.user_id == current_user_id) do
      "text-right"
    else
      ""
    end
  end
end
