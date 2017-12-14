defmodule Danton.Admin.PostController do
  use Danton.Web, :controller

  import Ecto.Query
  import Torch.Controller, only: [sort: 1, paginate: 4]

  alias Danton.Post
  alias Filtrex.Type.Config

  plug :put_layout, {Danton.LayoutView, "admin.html"}
  plug :scrub_params, "post" when action in [:create, :update]
  @filtrex [
    %Config{type: :date, keys: ~w(inserted_at activity_at), options: %{format: "{YYYY}-{0M}-{0D}"}},
    %Config{type: :text, keys: ~w(title description type url)}
  ]

  @pagination [page_size: 10]
  @pagination_distance 5

  def index(conn, params, _, _) do
    params =
      params
      |> Map.put_new("sort_direction", "desc")
      |> Map.put_new("sort_field", "inserted_at")

    {:ok, sort_direction} = Map.fetch(params, "sort_direction")
    {:ok, sort_field} = Map.fetch(params, "sort_field")
    {:ok, filter} = Filtrex.parse_params(@filtrex, params["post"] || %{})

    page =
      Post
      |> Filtrex.query(filter)
      |> order_by(^sort(params))
      |> paginate(Repo, params, @pagination)

    render conn, "index.html",
      posts: page.entries,
      page_number: page.page_number,
      page_size: page.page_size,
      total_pages: page.total_pages,
      total_entries: page.total_entries,
      distance: @pagination_distance,
      sort_field: sort_field,
      sort_direction: sort_direction
  end

  def new(conn, _params, _, _) do
    changeset = Post.changeset(%Post{})
    render conn, "new.html", changeset: changeset
  end

  def create(conn, %{"post" => post_params}, _, _) do
    changeset = Post.changeset(%Post{}, post_params)

    case Repo.insert(changeset) do
      {:ok, _post} ->
        conn
        |> put_flash(:info, "Post created successfully.")
        |> redirect(to: admin_post_path(conn, :index))
      {:error, changeset} ->
        conn
        |> put_status(400)
        |> render("new.html", changeset: changeset)
    end
  end

  def edit(conn, %{"id" => id}, _, _) do
    post = Repo.get!(Post, id)
    changeset = Post.changeset(post)
    render conn, "edit.html", changeset: changeset, post: post
  end

  def update(conn, %{"id" => id, "post" => post_params}, _, _) do
    post = Repo.get!(Post, id)
    changeset = Post.changeset(post, post_params)

    case Repo.update(changeset) do
      {:ok, _post} ->
        conn
        |> put_flash(:info, "Post updated successfully.")
        |> redirect(to: admin_post_path(conn, :index))
      {:error, changeset} ->
        conn
        |> put_status(400)
        |> render("edit.html", post: post, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}, _, _) do
    post = Repo.get!(Post, id)
    Repo.delete!(post)

    conn
    |> put_flash(:info, "Post deleted successfully.")
    |> redirect(to: admin_post_path(conn, :index))
  end
end
