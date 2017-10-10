defmodule Danton.Api.V1.PostController do
  use Danton.Web, :controller
  use Danton.CheckIn, :controller
  use Danton.ResourceAuthorization, :controller

  plug :authorize_api_resource, [:post, :view] when action in [:show]
  plug :authorize_api_resource, [:post, :edit] when action in [:update, :delete]

  plug :check_in, :front_page when action in [:front_page]
  plug :check_in, :channel when action in [:index]
  plug :check_in, :post when action in [:show]

  # ===========================
  # ACTIONS
  # ===========================

  def index(conn, %{"channel_id" => channel_id}, _current_user, _claims) do
    posts = Post.for_channel_stream(channel_id) |> Repo.all
    render(conn, "index.json", posts: posts)
  end

  def front_page(conn, _params, current_user, _claims) do
    posts = Post.for_front_page(current_user) |> Repo.all()
    render(conn, "index.json", posts: posts)
  end

  def create(conn, %{"channel_id" => channel_id, "post" => post, "message" => message}, current_user, _claims) do
    msg_params = %{user_id: current_user.id, body: message["body"]}
    channel = Repo.get(Channel, channel_id)

    case Post.create_for_channel_and_user(channel, current_user, post, msg_params) do
      {:ok, %{post: post}} ->
        conn
        |> put_status(:created)
        |> put_resp_header("location", post_path(conn, :show, post))
        |> render("show.json", post: Post.load_messages(post))
      {:error, _, changeset, _} ->
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
        render(conn, "show.json", post: Post.load_messages(post))
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Danton.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}, _current_user, _claims) do
		Post.destroy(id)
    send_resp(conn, :no_content, "")
  end
end
