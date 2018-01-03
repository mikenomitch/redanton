defmodule Danton.Api.V1.TagController do
  use Danton.Web, :controller

  # TODO: ADD BACK ONCE YOU CONVER THINGS
  # plug Danton.ApiAuthorization, [:tag, :view] when action in [:show]

  # ===========================
  # ACTIONS
  # ===========================

  def index(conn, %{"club_id" => club_id}, current_user, _claims) do
    all_club_ids = Club.for_user(current_user) |> Repo.all() |> Enum.map(&(&1.id))

    tags = Tag.for_club(club_id)
      |> Repo.all()
      |> Tag.with_post_counts_for_club_ids(all_club_ids)
      |> Tag.include_posts_tags()

    render_index(conn, tags)
  end

  def index(conn, _params, current_user, _claims) do
    club_ids = Club.for_user(current_user) |> Repo.all() |> Enum.map(&(&1.id))

    tags = Tag.for_user(current_user)
      |> Repo.all()
      |> Tag.with_post_counts_for_club_ids(club_ids)
      |> Tag.include_posts_tags()

    render_index(conn, tags)
  end

  defp render_index(conn, tags) do
    render(conn, "index.json", tags: tags)
  end

  def show(conn, %{"id" => id}, current_user, _claims) do
    club_ids = Club.for_user(current_user) |> Repo.all() |> Enum.map(&(&1.id))

    tag = Repo.get!(Tag, id)
      |> Tag.with_post_count_for_club_ids(club_ids)
      |> Tag.include_posts_tags()

    render(conn, "show.json", tag: tag)
  end
end
