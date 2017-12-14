defmodule Danton.Admin.MembershipControllerTest do
  alias Danton.Membership

  use Danton.ConnCase

  @valid_attrs %{club_id: 42, email: "some content", inserted_at: %{day: 17, month: 4, year: 2010}, status: "some content", type: "some content", user_id: 42}
  @invalid_attrs %{}

  test "lists all entries on index", %{conn: conn} do
    conn = get conn, admin_membership_path(conn, :index)
    assert html_response(conn, 200) =~ "Memberships"
  end

  test "renders form for new resources", %{conn: conn} do
    conn = get conn, admin_membership_path(conn, :new)
    assert html_response(conn, 200) =~ "New Membership"
  end

  test "creates resource and redirects when data is valid", %{conn: conn} do
    conn = post conn, admin_membership_path(conn, :create), membership: @valid_attrs
    assert redirected_to(conn) == admin_membership_path(conn, :index)
    assert Repo.get_by(Membership, @valid_attrs)
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, admin_membership_path(conn, :create), membership: @invalid_attrs
    assert html_response(conn, 400) =~ "New Membership"
  end

  test "renders form for editing chosen resource", %{conn: conn} do
    membership = Repo.insert! %Membership{}
    conn = get conn, admin_membership_path(conn, :edit, membership)
    assert html_response(conn, 200) =~ "Edit Membership"
  end

  test "updates chosen resource and redirects when data is valid", %{conn: conn} do
    membership = Repo.insert! %Membership{}
    conn = put conn, admin_membership_path(conn, :update, membership), membership: @valid_attrs
    assert redirected_to(conn) == admin_membership_path(conn, :index)
    assert Repo.get_by(Membership, @valid_attrs)
  end

  test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
    membership = Repo.insert! %Membership{}
    conn = put conn, admin_membership_path(conn, :update, membership), membership: @invalid_attrs
    assert html_response(conn, 400) =~ "Edit Membership"
  end

  test "deletes chosen resource", %{conn: conn} do
    membership = Repo.insert! %Membership{}
    conn = delete conn, admin_membership_path(conn, :delete, membership)
    assert redirected_to(conn) == admin_membership_path(conn, :index)
    refute Repo.get(Membership, membership.id)
  end
end