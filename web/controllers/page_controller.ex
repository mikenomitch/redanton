defmodule Danton.PageController do
  use Danton.Web, :controller

  def index(conn, _params) do
    # TODO: replace once mobile app handles users
    # current_user = Coherence.current_user(conn)
    current_user = true

    if current_user do
      redirect conn, to: "/front"
    else
      render conn, "index.html"
    end
  end
end
