defmodule Danton.UserController do
  use Danton.Web, :controller

  alias Danton.Repo
  alias Danton.User
  alias Danton.Authorization

  def new(conn, params, current_user, _claims) do
    render conn, "new.html", current_user: current_user
  end
end