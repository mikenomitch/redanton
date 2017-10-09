defmodule Danton.AdminAuthorization do
  import Phoenix.Controller
  import Plug.Conn
  def init(opts), do: opts

  def call(conn, _opts) do
    current_user = Guardian.Plug.current_resource(conn)
    if current_user.email == "mikenomitch@gmail.com" do
      conn
    else
      conn
      |> put_status(:not_found)
      |> render(Danton.PageView, "not_found.html")
      |> halt
    end
  end
end
