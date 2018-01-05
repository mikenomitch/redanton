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
      club_id: post.club_id,
      room_id: room_id,
      message_count: message_count,
      last_activity_time: Post.latest_activity_time(post),
      last_message: message && %{
        body: message.body,
        user_id: message.user_id
      },
      tags: serialize_tags(post.tags),
      posts_tags: serialize_post_tags(post.posts_tags)
    }
  end

  defp serialize_tags(tags) do
    Enum.map(tags, &%{id: &1.id, name: &1.name, post_count: &1.post_count})
  end

  defp serialize_post_tags(posts_tags) do
    Enum.map(
      posts_tags,
      &%{id: &1.id, post_id: &1.post_id, tag_id: &1.tag_id}
    )
  end
end
