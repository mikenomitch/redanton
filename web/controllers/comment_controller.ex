defmodule Danton.CommentController do
  use Danton.Web, :controller

  def index(conn, %{"post_id" => post_id}) do
    render conn, "index.html", post_id: post_id
  end

  def show(conn, %{"id" => id, "post_id" => post_id}) do
    render conn, "show.html", id: id, post_id: post_id
  end
end