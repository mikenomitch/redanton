defmodule Danton.PageController do
  use Danton.Web, :controller

  # ===========================
  # ACTIONS
  # ===========================

  def index(conn, _params, current_user, _claims) do
    if current_user do
      redirect conn, to: "/stream"
    else
      render put_layout(conn, "index.html"), "index.html"
    end
  end

  def about(conn, _params, _current_user, _claims) do
    render put_layout(conn, "auth.html"), "about.html"
  end

  def no_channels(conn, _params, _current_user, _claims) do
    render(conn, "no_channels.html", parent_type: nil, parent_id: nil)
  end

  def no_clubs(conn, _params, _current_user, _claims) do
    render(conn, "no_clubs.html", parent_type: nil, parent_id: nil)
  end

  def no_posts(conn, _params, _current_user, _claims) do
    render(conn, "no_posts.html", parent_type: nil, parent_id: nil)
  end
end
