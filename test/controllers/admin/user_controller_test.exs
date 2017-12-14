defmodule Danton.Admin.UserControllerTest do
  alias Danton.User

  use Danton.ConnCase

  @valid_attrs %{avatar: "some content", email: "some content", inserted_at: %{day: 17, month: 4, year: 2010}, name: "some content", status: "some content"}
  @invalid_attrs %{}

  test "lists all entries on index", %{conn: conn} do
    conn = get conn, admin_user_path(conn, :index)
    assert html_response(conn, 200) =~ "Users"
  end

  test "renders form for new resources", %{conn: conn} do
    conn = get conn, admin_user_path(conn, :new)
    assert html_response(conn, 200) =~ "New User"
  end

  test "creates resource and redirects when data is valid", %{conn: conn} do
    conn = post conn, admin_user_path(conn, :create), user: @valid_attrs
    assert redirected_to(conn) == admin_user_path(conn, :index)
    assert Repo.get_by(User, @valid_attrs)
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, admin_user_path(conn, :create), user: @invalid_attrs
    assert html_response(conn, 400) =~ "New User"
  end

  test "renders form for editing chosen resource", %{conn: conn} do
    user = Repo.insert! %User{}
    conn = get conn, admin_user_path(conn, :edit, user)
    assert html_response(conn, 200) =~ "Edit User"
  end

  test "updates chosen resource and redirects when data is valid", %{conn: conn} do
    user = Repo.insert! %User{}
    conn = put conn, admin_user_path(conn, :update, user), user: @valid_attrs
    assert redirected_to(conn) == admin_user_path(conn, :index)
    assert Repo.get_by(User, @valid_attrs)
  end

  test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
    user = Repo.insert! %User{}
    conn = put conn, admin_user_path(conn, :update, user), user: @invalid_attrs
    assert html_response(conn, 400) =~ "Edit User"
  end

  test "deletes chosen resource", %{conn: conn} do
    user = Repo.insert! %User{}
    conn = delete conn, admin_user_path(conn, :delete, user)
    assert redirected_to(conn) == admin_user_path(conn, :index)
    refute Repo.get(User, user.id)
  end
end