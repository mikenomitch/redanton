defmodule Danton.AuthorizationController do
  use Danton.Web, :controller
  use Guardian.Phoenix.Controller

  alias Danton.Repo
  alias Danton.Authorization
  plug Guardian.Plug.EnsureAuthenticated, handler: __MODULE__, typ: "access"

  def index(conn, params, current_user, _claims) do
    render conn, "index.html", current_user: current_user, authorizations: authorizations(current_user)
  end

  defp authorizations(user) do
    Ecto.Model.assoc(user, :authorizations) |> Repo.all
  end

  # TODO: move this into a shared location
  def unauthenticated(conn, _params) do
    conn
    |> put_flash(:error, "Authentication required")
    |> redirect(to: auth_path(conn, :login))
  end
end
