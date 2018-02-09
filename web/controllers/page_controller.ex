defmodule Danton.PageController do
  use Danton.Web, :controller

  # ===========================
  # ACTIONS
  # ===========================

  def index(conn, _params) do
    current_user = Guardian.Plug.current_resource(conn)

    if current_user do
      redirect conn, to: "/stream"
    else
      render put_layout(conn, "index.html"), "index.html"
    end
  end

  def about(conn, _params) do
    render put_layout(conn, "auth.html"), "about.html"
  end

  def privacy(conn, _params) do
    render put_layout(conn, "auth.html"), "privacy.html"
  end

  def licenses(conn, _params) do
    render put_layout(conn, "auth.html"), "licenses.html"
  end

  def no_channels(conn, _params) do
    render(conn, "no_channels.html", parent_type: nil, parent_id: nil)
  end

  def no_clubs(conn, _params) do
    render(conn, "no_clubs.html", parent_type: nil, parent_id: nil)
  end

  def no_posts(conn, _params) do
    render(conn, "no_posts.html", parent_type: nil, parent_id: nil)
  end
end
