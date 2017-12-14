defmodule Danton.Admin.NotificationControllerTest do
  alias Danton.Notification

  use Danton.ConnCase

  @valid_attrs %{inserted_at: %{day: 17, month: 4, year: 2010}, status: "some content", type: "some content", user_id: 42}
  @invalid_attrs %{}

  test "lists all entries on index", %{conn: conn} do
    conn = get conn, admin_notification_path(conn, :index)
    assert html_response(conn, 200) =~ "Notifications"
  end

  test "renders form for new resources", %{conn: conn} do
    conn = get conn, admin_notification_path(conn, :new)
    assert html_response(conn, 200) =~ "New Notification"
  end

  test "creates resource and redirects when data is valid", %{conn: conn} do
    conn = post conn, admin_notification_path(conn, :create), notification: @valid_attrs
    assert redirected_to(conn) == admin_notification_path(conn, :index)
    assert Repo.get_by(Notification, @valid_attrs)
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, admin_notification_path(conn, :create), notification: @invalid_attrs
    assert html_response(conn, 400) =~ "New Notification"
  end

  test "renders form for editing chosen resource", %{conn: conn} do
    notification = Repo.insert! %Notification{}
    conn = get conn, admin_notification_path(conn, :edit, notification)
    assert html_response(conn, 200) =~ "Edit Notification"
  end

  test "updates chosen resource and redirects when data is valid", %{conn: conn} do
    notification = Repo.insert! %Notification{}
    conn = put conn, admin_notification_path(conn, :update, notification), notification: @valid_attrs
    assert redirected_to(conn) == admin_notification_path(conn, :index)
    assert Repo.get_by(Notification, @valid_attrs)
  end

  test "does not update chosen resource and renders errors when data is invalid", %{conn: conn} do
    notification = Repo.insert! %Notification{}
    conn = put conn, admin_notification_path(conn, :update, notification), notification: @invalid_attrs
    assert html_response(conn, 400) =~ "Edit Notification"
  end

  test "deletes chosen resource", %{conn: conn} do
    notification = Repo.insert! %Notification{}
    conn = delete conn, admin_notification_path(conn, :delete, notification)
    assert redirected_to(conn) == admin_notification_path(conn, :index)
    refute Repo.get(Notification, notification.id)
  end
end