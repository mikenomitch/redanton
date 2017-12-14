defmodule Danton.Admin.AuthorizationControllerTest do
  alias Danton.Authorization

  use Danton.ConnCase

  @valid_attrs %{provider: "some content", refresh_token: "some content", token: "some content", uid: "some content", user_id: 42}
  @invalid_attrs %{}

  test "lists all entries on index", %{conn: conn} do
    conn = get conn, admin_authorization_path(conn, :index)
    assert html_response(conn, 200) =~ "Authorizations"
  end

  test "renders form for new resources", %{conn: conn} do
    conn = get conn, admin_authorization_path(conn, :new)
    assert html_response(conn, 200) =~ "New Authorization"
  end

  test "creates resource and redirects when data is valid", %{conn: conn} do
    conn = post conn, admin_authorization_path(conn, :create), authorization: @valid_attrs
    assert redirected_to(conn) == admin_authorization_path(conn, :index)
    assert Repo.get_by(Authorization, @valid_attrs)
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, admin_authorization_path(conn, :create), authorization: @invalid_attrs
    assert html_response(conn, 400) =~ "New Authorization"
  end

  test "renders form for editing chosen resource", %{conn: conn} do
    authorization = Repo.insert! %Authorization{}
    conn = get conn, admin_authorization_path(conn, :edit, authorization)
    assert html_response(conn, 200) =~ "Edit Authorization"
  end

  test "updates chosen resource and redirects when data is valid", %{conn: conn} do
    authorization = Repo.insert! %Authorization{}
    conn = put conn, admin_authorization_path(conn, :update, authorization), authorization: @valid_attrs
    assert redirected_to(conn) == admin_authorization_path(conn, :index)
    assert Repo.get_by(Authorization, @valid_attrs)
  end

  test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
    authorization = Repo.insert! %Authorization{}
    conn = put conn, admin_authorization_path(conn, :update, authorization), authorization: @invalid_attrs
    assert html_response(conn, 400) =~ "Edit Authorization"
  end

  test "deletes chosen resource", %{conn: conn} do
    authorization = Repo.insert! %Authorization{}
    conn = delete conn, admin_authorization_path(conn, :delete, authorization)
    assert redirected_to(conn) == admin_authorization_path(conn, :index)
    refute Repo.get(Authorization, authorization.id)
  end
end