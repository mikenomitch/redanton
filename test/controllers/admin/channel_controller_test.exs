defmodule Danton.Admin.ChannelControllerTest do
  alias Danton.Channel

  use Danton.ConnCase

  @valid_attrs %{club_id: 42, description: "some content", inserted_at: %{day: 17, month: 4, year: 2010}, name: "some content"}
  @invalid_attrs %{}

  test "lists all entries on index", %{conn: conn} do
    conn = get conn, admin_channel_path(conn, :index)
    assert html_response(conn, 200) =~ "Channels"
  end

  test "renders form for new resources", %{conn: conn} do
    conn = get conn, admin_channel_path(conn, :new)
    assert html_response(conn, 200) =~ "New Channel"
  end

  test "creates resource and redirects when data is valid", %{conn: conn} do
    conn = post conn, admin_channel_path(conn, :create), channel: @valid_attrs
    assert redirected_to(conn) == admin_channel_path(conn, :index)
    assert Repo.get_by(Channel, @valid_attrs)
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, admin_channel_path(conn, :create), channel: @invalid_attrs
    assert html_response(conn, 400) =~ "New Channel"
  end

  test "renders form for editing chosen resource", %{conn: conn} do
    channel = Repo.insert! %Channel{}
    conn = get conn, admin_channel_path(conn, :edit, channel)
    assert html_response(conn, 200) =~ "Edit Channel"
  end

  test "updates chosen resource and redirects when data is valid", %{conn: conn} do
    channel = Repo.insert! %Channel{}
    conn = put conn, admin_channel_path(conn, :update, channel), channel: @valid_attrs
    assert redirected_to(conn) == admin_channel_path(conn, :index)
    assert Repo.get_by(Channel, @valid_attrs)
  end

  test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
    channel = Repo.insert! %Channel{}
    conn = put conn, admin_channel_path(conn, :update, channel), channel: @invalid_attrs
    assert html_response(conn, 400) =~ "Edit Channel"
  end

  test "deletes chosen resource", %{conn: conn} do
    channel = Repo.insert! %Channel{}
    conn = delete conn, admin_channel_path(conn, :delete, channel)
    assert redirected_to(conn) == admin_channel_path(conn, :index)
    refute Repo.get(Channel, channel.id)
  end
end