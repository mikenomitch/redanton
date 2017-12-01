defmodule Danton.UserController do
  use Danton.Web, :controller

  plug :put_layout, "auth.html" when action in [:new]

  # ===========================
  # ACTIONS
  # ===========================

  def new(conn, _params, current_user, _claims) do
    render conn, "new.html", current_user: current_user
  end

  def settings(conn, _params, current_user, _claims) do
    changeset = User.changeset(current_user)

    render(conn, "settings.html", user: current_user, changeset: changeset)
  end

  def update(conn, params = %{"user" => user}, current_user, _claims) do
    user_params = Map.merge(user, %{"email" => current_user.email})

    case User.update_info_and_auth(current_user, user_params) do
      {:ok, user} ->
        conn
        |> put_flash(:info, "User updated successfully.")
        |> redirect(to: user_path(conn, :settings))
      {:error, changeset} ->
        render(conn, "settings.html", user: current_user, changeset: changeset)
    end
  end
end
