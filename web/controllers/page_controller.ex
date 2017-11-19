defmodule Danton.PageController do
  use Danton.Web, :controller

  # ===========================
  # ACTIONS
  # ===========================

  def index(conn, _params, current_user, _claims) do
    if current_user do
      redirect conn, to: "/front"
    else
      render put_layout(conn, "index.html"), "index.html"
    end
  end
end
