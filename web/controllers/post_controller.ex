defmodule Danton.PostController do
  use Danton.Web, :controller

  alias Danton.Post

  def index(conn,  %{"channel_id" => channel_id}) do
    posts = Repo.all(
      from p in Post,
      where: p.channel_id == ^channel_id,
      select: p
    )

    render(conn, "index.html", posts: posts, channel_id: channel_id)
  end

  def front_page(conn, _params) do
    # TODO: replace once mobile can handle users
    current_user = Repo.get(Danton.User, 1)

    clubs = current_user
      |> Ecto.assoc(:clubs)
      |> Repo.all

    channels = first(clubs) && Ecto.assoc(clubs, :channels) |> Repo.all
    posts = channels && first(channels) && Ecto.assoc(channels, :posts) |> Repo.all

    render(conn, "front_page.html", posts: posts)
  end

  def new(conn, %{"channel_id" => channel_id}) do
    changeset = Post.changeset(%Post{})
    render(conn, "new.html", changeset: changeset, channel_id: channel_id)
  end

  def create(conn, %{"post" => post_params, "channel_id" => channel_id}) do
    channel = Danton.Repo.get(Danton.Channel, channel_id)

    # clean up
    %Danton.Post{}
      |> Danton.Post.changeset(post_params)
      |> Ecto.Changeset.put_assoc(:channel, channel)
      |> Danton.Repo.insert()
      |> case do
      {:ok, _post} ->
        conn
        |> put_flash(:info, "Post created successfully.")
        |> redirect(to: channel_post_path(conn, :index, channel_id))
      {:error, changeset} ->
        render(conn, "new.html", changeset: changeset, channel_id: channel_id)
    end
  end

  def show(conn, %{"id" => id}) do
    post = Repo.get!(Post, id)
    render(conn, "show.html", post: post)
  end

  def edit(conn, %{"id" => id}) do
    post = Repo.get!(Post, id)
    changeset = Post.changeset(post)
    render(conn, "edit.html", post: post, changeset: changeset)
  end

  def update(conn, %{"id" => id, "post" => post_params}) do
    post = Repo.get!(Post, id)
    changeset = Post.changeset(post, post_params)

    case Repo.update(changeset) do
      {:ok, post} ->
        conn
        |> put_flash(:info, "Post updated successfully.")
        |> redirect(to: post_path(conn, :show, post))
      {:error, changeset} ->
        render(conn, "edit.html", post: post, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    post = Repo.get!(Post, id)
    channel_id = post.channel_id

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(post)

    conn
    |> put_flash(:info, "Post deleted successfully.")
    |> redirect(to: channel_post_path(conn, :index, channel_id))
  end
end
