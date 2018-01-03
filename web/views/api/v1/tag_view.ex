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
      posts_tags: []
    }
  end
end
