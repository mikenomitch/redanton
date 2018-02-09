defmodule Danton.TagController do
  use Danton.Web, :controller
  use Danton.CheckIn, :controller
  use Danton.Controller.Helpers, :no_items_rendering

  @page_size 20

  plug Danton.WebAuthorization, [:tag, :view] when action in [:show]
  plug Guardian.Plug.EnsureAuthenticated, handler: __MODULE__, typ: "access"

  # ===========================
  # ACTIONS
  # ===========================

  def index(conn, params) do
    current_user = Guardian.Plug.current_resource(conn)

    # TODO: do this
    # case index_template(current_user, %{include_tags: true}) do
    #   :no_clubs -> render_no_clubs(conn)
    #   :no_tags -> render_no_tags(conn)
    #   :no_posts -> render_no_posts(conn)
    #   :main -> render_tag_index(conn, params, current_user)
    # end

    render_tag_index(conn, params, current_user)
  end

  defp render_tag_index(conn, params, current_user) do
    pagination_params = Map.merge(params, %{page_size: @page_size})
    page = Tag.for_user(current_user)
      |> Repo.paginate(pagination_params)

    club_ids = Club.for_user(current_user)
      |> Repo.all()
      |> Enum.map(&(&1.id))

    tags = page.entries |> Tag.with_post_counts_for_club_ids(club_ids)

    conn
    |> add_tags_crumb()
    |> render(
      "index.html",
      tags: tags,
      page_number: page.page_number,
      page_size: page.page_size,
      total_pages: page.total_pages,
      total_entries: page.total_entries,
      base_url: "/tags"
    )
  end

  def show(conn, params = %{"id" => id}) do
    current_user = Guardian.Plug.current_resource(conn)

    tag = Repo.get(Tag, id)
    club_ids = Club.for_user(current_user)
      |> Repo.all()
      |> Enum.map(&(&1.id))

    page = Ecto.assoc(tag, :posts)
      |> Post.for_club_ids(club_ids)
      |> Post.by_activity()
      |> Repo.paginate(params)

    posts = page.entries |> Post.with_stream_preloads() |> Post.with_posts_tags_and_tags()

    conn
    |> add_tags_crumb()
    |> add_tag_crumb(tag)
    |> render(
      "show.html",
      tag: tag,
      posts: posts,
      page_number: page.page_number,
      page_size: page.page_size,
      total_pages: page.total_pages,
      total_entries: page.total_entries
    )
  end

  # BREADCRUMBS

  defp add_tags_crumb(conn) do
    add_breadcrumb(conn, name: "Tags", url: "/tags/")
  end

  defp add_tag_crumb(conn, tag) do
    add_breadcrumb(conn, name: tag.name, url: "/tags/" <> Integer.to_string(tag.id))
  end
end
