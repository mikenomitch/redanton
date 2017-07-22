defmodule Danton.AuthorizationController do
  use Danton.Web, :controller
  use Guardian.Phoenix.Controller

  alias Danton.Repo
  alias Danton.Authorization

  def index(conn, params, current_user, _claims) do
    render conn, "index.html", current_user: current_user, authorizations: authorizations(current_user)
  end

  defp authorizations(user) do
    Ecto.Model.assoc(user, :authorizations) |> Repo.all
  end
end
