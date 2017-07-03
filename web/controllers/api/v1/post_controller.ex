defmodule Danton.Api.V1.PostController do
  use Danton.Web, :controller

  alias Danton.Post

  def index(conn, %{"channel_id" => channel_id}) do
    posts = Repo.all(
      from p in Post,
      where: p.channel_id == ^channel_id,
      select: p
    )

    render(conn, "index.json", posts: posts)
  end

  def front_page(conn, _params) do
    # TODO: replace once mobile app handles users
    # current_user = Coherence.current_user(conn)
    current_user = Repo.get(Danton.User, 1)

    clubs = current_user
      |> Ecto.assoc(:clubs)
      |> Repo.all

    channels = Ecto.assoc(clubs, :channels) |> Repo.all
    posts = Ecto.assoc(channels, :posts) |> Repo.all

    render(conn, "index.json", posts: posts)
  end

  # TODO: add proper relationship logic
  def create(conn, %{"post" => post_params}) do
    changeset = Post.changeset(%Post{}, post_params)

    case Repo.insert(changeset) do
      {:ok, post} ->
        conn
        |> put_status(:created)
        |> put_resp_header("location", post_path(conn, :show, post))
        |> render("show.json", post: post)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Danton.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    post = Repo.get!(Post, id)
    render(conn, "show.json", post: post)
  end

  def update(conn, %{"id" => id, "post" => post_params}) do
    post = Repo.get!(Post, id)
    changeset = Post.changeset(post, post_params)

    case Repo.update(changeset) do
      {:ok, post} ->
        render(conn, "show.json", post: post)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Danton.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    post = Repo.get!(Post, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(post)

    send_resp(conn, :no_content, "")
  end
end
