defmodule Danton.Admin.PostControllerTest do
  alias Danton.Post

  use Danton.ConnCase

  @valid_attrs %{channel_id: 42, description: "some content", inserted_at: %{day: 17, month: 4, year: 2010}, title: "some content", type: "some content", url: "some content", user_id: 42}
  @invalid_attrs %{}

  test "lists all entries on index", %{conn: conn} do
    conn = get conn, admin_post_path(conn, :index)
    assert html_response(conn, 200) =~ "Posts"
  end

  test "renders form for new resources", %{conn: conn} do
    conn = get conn, admin_post_path(conn, :new)
    assert html_response(conn, 200) =~ "New Post"
  end

  test "creates resource and redirects when data is valid", %{conn: conn} do
    conn = post conn, admin_post_path(conn, :create), post: @valid_attrs
    assert redirected_to(conn) == admin_post_path(conn, :index)
    assert Repo.get_by(Post, @valid_attrs)
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, admin_post_path(conn, :create), post: @invalid_attrs
    assert html_response(conn, 400) =~ "New Post"
  end

  test "renders form for editing chosen resource", %{conn: conn} do
    post = Repo.insert! %Post{}
    conn = get conn, admin_post_path(conn, :edit, post)
    assert html_response(conn, 200) =~ "Edit Post"
  end

  test "updates chosen resource and redirects when data is valid", %{conn: conn} do
    post = Repo.insert! %Post{}
    conn = put conn, admin_post_path(conn, :update, post), post: @valid_attrs
    assert redirected_to(conn) == admin_post_path(conn, :index)
    assert Repo.get_by(Post, @valid_attrs)
  end

  test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
    post = Repo.insert! %Post{}
    conn = put conn, admin_post_path(conn, :update, post), post: @invalid_attrs
    assert html_response(conn, 400) =~ "Edit Post"
  end

  test "deletes chosen resource", %{conn: conn} do
    post = Repo.insert! %Post{}
    conn = delete conn, admin_post_path(conn, :delete, post)
    assert redirected_to(conn) == admin_post_path(conn, :index)
    refute Repo.get(Post, post.id)
  end
end