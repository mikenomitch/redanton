defmodule Danton.Api.V1.PostController do
  use Danton.Web, :controller

	alias Danton.Post
	alias Danton.User
	alias Danton.Club
	alias Danton.Channel

  def index(conn, %{"channel_id" => channel_id}, _current_user, _claims) do
    posts = Repo.all(
      from p in Post,
      where: p.channel_id == ^channel_id,
      select: p
    )

    render(conn, "index.json", posts: posts)
  end

  def front_page(conn, _params, current_user, _claims) do
		posts = User.clubs_for_user(current_user)
			|> Club.channels_for_clubs
			|> Channel.posts_for_channels

    render(conn, "index.json", posts: posts)
  end

  # TODO: add proper relationship logic
  def create(conn, %{"channel_id" => channel_id, "post" => post_params, "message" => message_params}, current_user, _claims) do
    channel = Repo.get(Channel, channel_id)

    # TODO: There must be a nicer way to do this
    post_struct = %Post{
      title: post_params["title"],
      description: post_params["description"],
      type: post_params["type"],
      url: post_params["url"],
    }

    case Channel.make_post_for_user(channel, current_user, post_struct) do
      {:ok, post} ->
        # TODO: find a better spot for this
        message = %{user_id: current_user.id, body: message_params["body"]}
        Danton.Post.make_room(post, message)
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

  def show(conn, %{"id" => id}, _current_user, _claims) do
    post = Repo.get!(Post, id)
    render(conn, "show.json", post: post)
  end

  def update(conn, params, _current_user, _claims) do
    post = Repo.get!(Post, params["id"])
    post_params = Map.delete(params, "id")
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

  def delete(conn, %{"id" => id}, _current_user, _claims) do
		Danton.Post.destroy(id)
    send_resp(conn, :no_content, "")
  end
end
