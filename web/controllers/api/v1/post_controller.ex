defmodule Danton.Api.V1.PostController do
  use Danton.Web, :controller
  use Danton.CheckIn, :controller

  plug Danton.ApiAuthorization, [:post, :view] when action in [:show]
  plug Danton.ApiAuthorization, [:post, :edit] when action in [:update, :delete]

  plug :check_in, :front_page when action in [:front_page]
  plug :check_in, :channel when action in [:index]
  plug :check_in, :post when action in [:show]

  # ===========================
  # ACTIONS
  # ===========================

  def index(conn, params = %{"tag_id" => tag_id}, current_user, _claims) do
    page = Post.for_tag_id(tag_id)
      |> Post.for_club_ids(Club.ids_for_user(current_user))
      |> Post.by_activity()
      |> Repo.paginate(params)

      render_page(conn, page, current_user)
  end

  def index(conn, params = %{"club_id" => club_id}, current_user, _claims) do
    page = Post.for_club_ids([club_id])
      |> Post.by_activity()
      |> Repo.paginate(params)

    render_page(conn, page, current_user)
  end

  def front_page(conn, params, current_user, _claims) do
    page = Post.for_front_page(current_user) |> Repo.paginate(params)
    render_page(conn, page, current_user)
  end

  defp render_page(conn, page, current_user) do
    posts = page.entries
      |> Post.with_stream_preloads()
      |> Post.with_posts_tags_and_tags()
      |> Post.with_real_post_counts(Club.ids_for_user(current_user))

    render(conn, "index.json", posts: posts)
  end

  def create(conn, %{"club_id" => club_id, "post" => post, "message" => message}, current_user, _claims) do
    msg_params = %{user_id: current_user.id, body: message["body"]}
    club = Repo.get(Club, club_id)

    case Post.create_for_club_and_user(club, current_user, post, msg_params) do
      {:ok, %{post: post}} ->
        post_with_assoc = post
          |> Post.load_messages()
          |> Post.with_posts_tags_and_tags()
          |> Post.with_real_post_counts(Club.ids_for_user(current_user))

        conn
        |> put_status(:created)
        |> put_resp_header("location", post_path(conn, :show, post_with_assoc))
        |> render("show.json", post: Post.load_messages(post_with_assoc))
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

  def update(conn, params, current_user, _claims) do
    post = Repo.get!(Post, params["id"])
    post_params = Map.delete(params, "id")

    case Post.update_from_params(post, post_params) do
      {:ok, post} ->
        post_with_assoc = post
          |> Post.load_messages()
          |> Post.with_posts_tags_and_tags()
          |> Post.with_real_post_counts(Club.ids_for_user(current_user))

        render(conn, "show.json", post: post_with_assoc)
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
