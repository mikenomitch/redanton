defmodule Danton.PostController do
  use Danton.Web, :controller

  def index(conn, %{"channel_id" => channel_id}) do
    render conn, "index.html", channel_id: channel_id
  end

  def show(conn, %{"channel_id" => channel_id, "id" => id}) do
    render conn, "show.html", channel_id: channel_id, id: id
  end
end