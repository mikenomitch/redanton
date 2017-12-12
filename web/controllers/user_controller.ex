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

  def update(conn, %{"user" => user}, current_user, _claims) do
    user_params = Map.merge(user, %{"email" => current_user.email})

    case User.update_info_and_auth(current_user, user_params) do
      {:ok, _user} ->
        conn
        |> put_flash(:info, "User updated successfully.")
        |> redirect(to: user_path(conn, :settings))
      {:error, reason = %Ecto.Changeset{}} ->
        conn
        |> put_flash(:error, "There was an issue updating. Try again.")
        |> render("settings.html", user: current_user, changeset: User.changeset(current_user))
      {:error, reason} ->
        # this should validate thru the user but doesn't now
        conn
        |> put_flash(:error, reason)
        |> render("settings.html", user: current_user, changeset: User.changeset(current_user))
    end
  end

  def password_reset(conn, _params, _current_user, _claims) do
    render(conn, "password_reset.html")
  end

  def set_password(conn, %{"token" => token} , _current_user, _claims) do
    render(conn, "set_password.html", token: token)
  end

  def set_new_password(conn, %{"password" => pw, "password_confirmation" => pwc, "token" => token}, _current_user, _claims) do
    with {:ok, claims = %{"typ" => "reset"}} <- Guardian.decode_and_verify(token),
         {:ok, user} <- Guardian.serializer.from_token(claims["sub"]),
         {:ok, _new_auth} <- Authorization.update_authorization_for_user_params(%{"password" => pw, "password_confirmation" => pwc, "email" => user.email})
    do
      successful_password_reset(conn)
    else
      {:error, err} -> bad_password_reset(conn, token, err)
      _err -> bad_password_reset(conn, token)
    end
  end

  defp successful_password_reset(conn) do
    conn
    |> put_flash(:info, "Password Updated.")
    |> redirect(to: "/login")
  end

  defp bad_password_reset(conn, token, error \\ "There was an issue updating your password.") do
    conn
    |> put_flash(:error, error)
    |> redirect(to: "/set_password?token=" <> token)
  end

  def send_reset_email(conn, %{"email" => email}, _current_user, _claims) do
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
