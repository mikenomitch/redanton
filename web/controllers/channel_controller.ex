defmodule Danton.ChannelController do
  use Danton.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end

  def show(conn, %{"id" => id}) do
    render conn, "show.html", id: id
  end
end