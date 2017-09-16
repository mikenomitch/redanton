defmodule Danton.UserController do
  use Danton.Web, :controller

  # ===========================
  # ACTIONS
  # ===========================

  def new(conn, _params, current_user, _claims) do
    render conn, "new.html", current_user: current_user
  end
end