defmodule Danton.Api.V1.AuthController do
  @moduledoc """
  Handles the Überauth integration.
  This controller implements the request and callback phases for all providers.
  The actual creation and lookup of users/authorizations is handled by UserFromAuth
  """
  use Danton.Web, :controller
  alias Danton.UserFromAuth
  plug Ueberauth

	# TODO: change this to act more like
	# http://blog.overstuffedgorilla.com/simple-guardian-api-authentication/
	# and give you user info and expiration info

	def login(%{assigns: %{ueberauth_auth: auth}} = conn, params) do
		case Danton.User.find_and_confirm_password(params) do
			{:ok, user} ->
				new_conn = Guardian.Plug.api_sign_in(conn, user)
				jwt = Guardian.Plug.current_token(new_conn)
				claims = Guardian.Plug.claims(new_conn)

				new_conn
				|> put_resp_header("authorization", "Bearer #{jwt}")
				|> json %{wat: user.id, jwt: jwt}
			{:error, changeset} ->
				conn
				|> put_status(401)
				|> json %{error: "Could Not Login"}
		end
	end

	def login(conn, params, current_user, _claims) do
		case Danton.User.find_and_confirm_password(params) do
			{:ok, user} ->
				new_conn = Guardian.Plug.api_sign_in(conn, user)
				jwt = Guardian.Plug.current_token(new_conn)
				claims = Guardian.Plug.claims(new_conn)

				new_conn
				|> put_resp_header("authorization", "Bearer #{jwt}")
				|> json %{user: user.id, jwt: jwt}
			{:error, changeset} ->
				conn
				|> put_status(401)
				|> json %{error: "Could Not Login"}
		end
	end

  def logout(conn, _params, current_user, _claims) do
    if current_user do
      conn
      # This clears the whole session.
      # We could use sign_out(:default) to just revoke this token
      # but I prefer to clear out the session. This means that because we
      # use tokens in two locations - :default and :admin - we need to load it (see above)
      |> Guardian.Plug.sign_out
			|> json %{message: "Signed Out"}
    else
      conn
			|> put_status(422)
			|> json %{error: "Not Logged In."}
    end
  end

  defp auths(nil), do: []
  defp auths(%Danton.User{} = user) do
    Ecto.Model.assoc(user, :authorizations)
      |> Repo.all
      |> Enum.map(&(&1.provider))
  end
end
