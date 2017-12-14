defmodule Danton.Admin.MessageControllerTest do
  alias Danton.Message

  use Danton.ConnCase

  @valid_attrs %{body: "some content", inserted_at: %{day: 17, month: 4, year: 2010}, room_id: 42, user_id: 42}
  @invalid_attrs %{}

  test "lists all entries on index", %{conn: conn} do
    conn = get conn, admin_message_path(conn, :index)
    assert html_response(conn, 200) =~ "Messages"
  end

  test "renders form for new resources", %{conn: conn} do
    conn = get conn, admin_message_path(conn, :new)
    assert html_response(conn, 200) =~ "New Message"
  end

  test "creates resource and redirects when data is valid", %{conn: conn} do
    conn = post conn, admin_message_path(conn, :create), message: @valid_attrs
    assert redirected_to(conn) == admin_message_path(conn, :index)
    assert Repo.get_by(Message, @valid_attrs)
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, admin_message_path(conn, :create), message: @invalid_attrs
    assert html_response(conn, 400) =~ "New Message"
  end

  test "renders form for editing chosen resource", %{conn: conn} do
    message = Repo.insert! %Message{}
    conn = get conn, admin_message_path(conn, :edit, message)
    assert html_response(conn, 200) =~ "Edit Message"
  end

  test "updates chosen resource and redirects when data is valid", %{conn: conn} do
    message = Repo.insert! %Message{}
    conn = put conn, admin_message_path(conn, :update, message), message: @valid_attrs
    assert redirected_to(conn) == admin_message_path(conn, :index)
    assert Repo.get_by(Message, @valid_attrs)
  end

  test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
    message = Repo.insert! %Message{}
    conn = put conn, admin_message_path(conn, :update, message), message: @invalid_attrs
    assert html_response(conn, 400) =~ "Edit Message"
  end

  test "deletes chosen resource", %{conn: conn} do
    message = Repo.insert! %Message{}
    conn = delete conn, admin_message_path(conn, :delete, message)
    assert redirected_to(conn) == admin_message_path(conn, :index)
    refute Repo.get(Message, message.id)
  end
end