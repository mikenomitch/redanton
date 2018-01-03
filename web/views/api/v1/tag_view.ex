defmodule Danton.Api.V1.TagView do
  use Danton.Web, :view

  def render("index.json", %{tags: tags}) do
    %{data: render_many(tags, Danton.Api.V1.TagView, "tag.json")}
  end

  def render("show.json", %{tag: tag}) do
    %{data: render_one(tag, Danton.Api.V1.TagView, "tag.json")}
  end

  def render("tag.json", %{tag: tag}) do
    %{
      id: tag.id,
      name: tag.name,
      post_count: tag.post_count,
      posts_tags: serialize_post_tags(tag.posts_tags)
    }
  end

  defp serialize_post_tags(posts_tags) do
    Enum.map(posts_tags, &%{
      id: &1.id, post_id: &1.post_id, tag_id: &1.tag_id
    })
  end
end
