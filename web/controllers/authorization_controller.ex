defmodule Danton.AuthorizationController do
  use Danton.Web, :controller
  plug Guardian.Plug.EnsureAuthenticated, handler: __MODULE__, typ: "access"

  # ===========================
  # ACTIONS
  # ===========================


  def index(conn, _params) do
    current_user = Guardian.Plug.current_resource(conn)
    render conn, "index.html", current_user: current_user, authorizations: authorizations(current_user)
  end

  defp authorizations(user) do
    Ecto.assoc(user, :authorizations) |> Repo.all
  end
end
