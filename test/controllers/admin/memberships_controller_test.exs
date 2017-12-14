defmodule Danton.Admin.MembershipsControllerTest do
  alias Danton.Memberships

  use Danton.ConnCase

  @valid_attrs %{club_id: 42, email: "some content", inserted_at: %{day: 17, month: 4, year: 2010}, status: "some content", type: "some content", user_id: 42}
  @invalid_attrs %{}

  test "lists all entries on index", %{conn: conn} do
    conn = get conn, admin_memberships_path(conn, :index)
    assert html_response(conn, 200) =~ "Memberships"
  end

  test "renders form for new resources", %{conn: conn} do
    conn = get conn, admin_memberships_path(conn, :new)
    assert html_response(conn, 200) =~ "New Memberships"
  end

  test "creates resource and redirects when data is valid", %{conn: conn} do
    conn = post conn, admin_memberships_path(conn, :create), memberships: @valid_attrs
    assert redirected_to(conn) == admin_memberships_path(conn, :index)
    assert Repo.get_by(Memberships, @valid_attrs)
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, admin_memberships_path(conn, :create), memberships: @invalid_attrs
    assert html_response(conn, 400) =~ "New Memberships"
  end

  test "renders form for editing chosen resource", %{conn: conn} do
    memberships = Repo.insert! %Memberships{}
    conn = get conn, admin_memberships_path(conn, :edit, memberships)
    assert html_response(conn, 200) =~ "Edit Memberships"
  end

  test "updates chosen resource and redirects when data is valid", %{conn: conn} do
    memberships = Repo.insert! %Memberships{}
    conn = put conn, admin_memberships_path(conn, :update, memberships), memberships: @valid_attrs
    assert redirected_to(conn) == admin_memberships_path(conn, :index)
    assert Repo.get_by(Memberships, @valid_attrs)
  end

  test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
    memberships = Repo.insert! %Memberships{}
    conn = put conn, admin_memberships_path(conn, :update, memberships), memberships: @invalid_attrs
    assert html_response(conn, 400) =~ "Edit Memberships"
  end

  test "deletes chosen resource", %{conn: conn} do
    memberships = Repo.insert! %Memberships{}
    conn = delete conn, admin_memberships_path(conn, :delete, memberships)
    assert redirected_to(conn) == admin_memberships_path(conn, :index)
    refute Repo.get(Memberships, memberships.id)
  end
end