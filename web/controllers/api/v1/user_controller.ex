defmodule Danton.Api.V1.UserController do
  use Danton.Web, :controller

  # ===========================
  # ACTIONS
  # ===========================

  def index(conn, %{"club_id" => club_id}, _current_user, _claims) do
    users = User.for_clubs([club_id]) |> Repo.all()
		render(conn, "index.json", users: users)
  end

  def index(conn, %{"post_id" => post_id}, _current_user, _claims) do
    users = User.for_post(post_id) |> Repo.all()
		render(conn, "index.json", users: users)
  end

  def index(conn, _params, _current_user, _claims) do
    # TODO: scope this to any of the users in a users's clubs
    # OR remove this and have posts return poster names
		users = Repo.all(User)
		render(conn, "index.json", users: users)
  end

  def update_self(conn, %{"user" => user_params}, current_user, _claims) do
    case User.update_info_and_auth(current_user, user_params) do
      {:ok, user} ->
        render(conn, "show.json", user: user)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Danton.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def create_token(conn, %{"token" => token_value}, current_user, _claims) do
    case UserToken.find_or_create_for_user(token_value, current_user) do
      {:ok, _token} ->
        conn
        |> put_status(200)
        |> json(%{error: "Success"})
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Danton.ChangesetView, "error.json", changeset: changeset)
    end
  end
end
