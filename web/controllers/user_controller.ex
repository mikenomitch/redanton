defmodule Danton.UserController do
  use Danton.Web, :controller

  plug :put_layout, "auth.html" when action in [:new, :password_reset, :set_password]

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

  def password_reset(conn, _params, _current_user, _claims) do
    render(conn, "password_reset.html")
  end

  def set_password(conn, _params, _current_user, _claims) do
    render(conn, "set_password.html")
  end

  def set_new_password(conn, params = %{"password" => password, "password_confirmation" => password_confirmation}, _current_user, _claims) do
    # hrm... how do we ID the user here?
    user = Repo.get(User, 1)

    if (user) do
      Authorization.update_authorization_for_user_params(%{
        "password" => password,
        "password_confirmation" => password_confirmation,
        "email" => user.email
      })

      conn
      |> put_flash(:info, "Password Updated.")
      |> redirect(to: "/login")
    else
      conn
      |> put_flash(:error, "There was an issue updating your password.")
      |> redirect(to: "/set_password")
    end
  end

  def send_reset_email(conn, params = %{"email" => email}, _current_user, _claims) do
    user = Repo.get_by(User, email: email)

    if (user) do
      User.send_password_reset(user)
      valid_reset_resp(conn)
    else
      invalid_reset_resp(conn)
    end
  end

  defp valid_reset_resp(conn) do
    conn
    |> put_flash(:info, "Email Sent! Click the link in the email to reset your password.")
    |> redirect(to: "/")
  end

  defp invalid_reset_resp(conn) do
    conn
    |> put_flash(:error, "Email provided did not match any existing users.")
    |> redirect(to: "/password_reset")
  end
end
