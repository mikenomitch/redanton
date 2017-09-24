defmodule Danton.AuthorizationController do
  use Danton.Web, :controller
  use Guardian.Phoenix.Controller

  plug Guardian.Plug.EnsureAuthenticated, handler: __MODULE__, typ: "access"

  # ===========================
  # ACTIONS
  # ===========================


  def index(conn, _params, current_user, _claims) do
    render conn, "index.html", current_user: current_user, authorizations: authorizations(current_user)
  end

  defp authorizations(user) do
    Ecto.Model.assoc(user, :authorizations) |> Repo.all
  end
end
