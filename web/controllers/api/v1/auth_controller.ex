defmodule Danton.Api.V1.AuthController do
  @moduledoc """
  Handles the Überauth integration.
  This controller implements the request and callback phases for all providers.
	"""

	# NOTE: this is based off the app here:
	# http://blog.overstuffedgorilla.com/simple-guardian-api-authentication/

	use Danton.Web, :controller

  plug Ueberauth

	# ===========================
  # ACTIONS
  # ===========================

	def login(conn, params) do
		case User.find_and_confirm_password(params) do
      {:ok, user} ->
        new_conn = Danton.Guardian.Plug.sign_in(conn, user, token_type: :access)
				jwt = Danton.Guardian.Plug.current_token(new_conn)
				{:ok, claims} = Danton.Guardian.decode_and_verify(jwt)
				exp = Map.get(claims, "exp")

				new_conn
				|> put_resp_header("authorization", "Bearer #{jwt}")
				# |> put_resp_header("x-expires", exp)
        |> render("login.json", user: user, jwt: jwt, exp: exp)
			{:error, _} ->
				conn
				|> put_status(401)
				|> json(%{error: "Could Not Login"})
		end
	end

  def logout(conn, _params) do
    current_user = Guardian.Plug.current_resource(conn)
    if current_user do
      conn
      # This clears the whole session.
      # We could use sign_out(:default) to just revoke this token
      # but I prefer to clear out the session. This means that because we
      # use tokens in two locations - :default and :admin - we need to load it (see above)
      |> Danton.Guardian.Plug.sign_out(current_user)
			|> json(%{message: "Signed Out"})
    else
      conn
			|> put_status(401)
			|> json(%{error: "Not Logged In."})
    end
  end

  def sign_up(conn, params) do
    case User.sign_up(params) do
      {:ok, user} ->
        new_conn = Danton.Guardian.Plug.sign_in(conn, user, token_type: :access)
				jwt = Danton.Guardian.Plug.current_token(new_conn)
        {:ok, claims} = Danton.Guardian.decode_and_verify(jwt)
				exp = Map.get(claims, "exp")

				new_conn
				|> put_resp_header("authorization", "Bearer #{jwt}")
				# |> put_resp_header("x-expires", exp)
        |> render("login.json", user: user, jwt: jwt, exp: exp)
      {:error, reason} ->
        conn
        |> put_status(401)
        |> json(%{error: reason})
    end
	end
end
