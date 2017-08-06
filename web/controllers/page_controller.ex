defmodule Danton.PageController do
  use Danton.Web, :controller

  def index(conn, _params, current_user, _claims) do
    if current_user do
      redirect conn, to: "/front"
    else
      render conn, "index.html"
    end
  end
end
