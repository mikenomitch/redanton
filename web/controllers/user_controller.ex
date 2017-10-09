defmodule Danton.UserController do
  use Danton.Web, :controller

  plug :put_layout, "auth.html" when action in [:new]

  # ===========================
  # ACTIONS
  # ===========================

  def new(conn, _params, current_user, _claims) do
    render conn, "new.html", current_user: current_user
  end
end