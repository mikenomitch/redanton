defmodule Danton.Admin.ClubControllerTest do
  alias Danton.Club

  use Danton.ConnCase

  @valid_attrs %{description: "some content", inserted_at: %{day: 17, month: 4, year: 2010}, name: "some content"}
  @invalid_attrs %{}

  test "lists all entries on index", %{conn: conn} do
    conn = get conn, admin_club_path(conn, :index)
    assert html_response(conn, 200) =~ "Clubs"
  end

  test "renders form for new resources", %{conn: conn} do
    conn = get conn, admin_club_path(conn, :new)
    assert html_response(conn, 200) =~ "New Club"
  end

  test "creates resource and redirects when data is valid", %{conn: conn} do
    conn = post conn, admin_club_path(conn, :create), club: @valid_attrs
    assert redirected_to(conn) == admin_club_path(conn, :index)
    assert Repo.get_by(Club, @valid_attrs)
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, admin_club_path(conn, :create), club: @invalid_attrs
    assert html_response(conn, 400) =~ "New Club"
  end

  test "renders form for editing chosen resource", %{conn: conn} do
    club = Repo.insert! %Club{}
    conn = get conn, admin_club_path(conn, :edit, club)
    assert html_response(conn, 200) =~ "Edit Club"
  end

  test "updates chosen resource and redirects when data is valid", %{conn: conn} do
    club = Repo.insert! %Club{}
    conn = put conn, admin_club_path(conn, :update, club), club: @valid_attrs
    assert redirected_to(conn) == admin_club_path(conn, :index)
    assert Repo.get_by(Club, @valid_attrs)
  end

  test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
    club = Repo.insert! %Club{}
    conn = put conn, admin_club_path(conn, :update, club), club: @invalid_attrs
    assert html_response(conn, 400) =~ "Edit Club"
  end

  test "deletes chosen resource", %{conn: conn} do
    club = Repo.insert! %Club{}
    conn = delete conn, admin_club_path(conn, :delete, club)
    assert redirected_to(conn) == admin_club_path(conn, :index)
    refute Repo.get(Club, club.id)
  end
end