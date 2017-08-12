defmodule Danton.Controller.APIHelper do
	use Danton.Web, :router
  import Plug.Conn

	def unauthenticated(conn, params) do
    conn
		|> put_status(401)
		|> json %{error: "Authentication required."}
  end
end
