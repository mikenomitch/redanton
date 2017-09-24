defmodule Danton.Controller.Helpers do
  import Plug.Conn

  def redirect_back(conn, alternative \\ "/") do
    path = conn
    |> get_req_header("referer")
    |> referrer
    path || alternative
  end

  defp referrer([]), do: nil
  defp referrer([h|_]), do: h

  defmacro __using__(:auth) do
    quote do
      def unauthenticated(conn, _params) do
        conn
        |> put_flash(:error, "Authentication required")
        |> redirect(to: Danton.Router.Helpers.auth_path(conn, :login))
      end
    end
  end
end
