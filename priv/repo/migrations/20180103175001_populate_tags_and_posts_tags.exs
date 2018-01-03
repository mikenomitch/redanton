defmodule Danton.Repo.Migrations.PopulateTagsAndPostsTags do
  alias Danton.Repo
  alias Danton.Channel
  alias Danton.Post
  alias Danton.Tag
  alias Danton.PostsTags

  use Ecto.Migration

  def make_post_tag(tag, post) do
    Repo.insert!(
      %Danton.PostsTags(post_id: post.id, tag_id: tag.id)
    )
  end

  def make_tag_and_relationship(chan) do
    Repo.insert!(
      %Danton.Tag{name: chan.name},
      on_conflict: [set: [name: chan.name]],
      conflict_target: :name
    )

    posts = Post.for_channel(chan) |> Repo.all()
    Enum.each(posts, &(make_post_tag(tag, &1)))
  end

  def change do
    Enum.each(
      Repo.all(Channel),
      &make_tag_and_relationship/1
    )
  end
end
