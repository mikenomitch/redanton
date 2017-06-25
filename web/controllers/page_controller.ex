defmodule Danton.PageController do
  use Danton.Web, :controller

  def index(conn, _params) do
    if Coherence.current_user(conn) do
      redirect conn, to: "/front"
    else
      render conn, "index.html"
    end
  end
end
