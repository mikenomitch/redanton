defmodule Danton.Admin.NotificationController do
  use Danton.Web, :controller

  import Ecto.Query
  import Torch.Controller, only: [sort: 1, paginate: 4]

  alias Danton.Notification
  alias Filtrex.Type.Config

  plug :put_layout, {Danton.LayoutView, "admin.html"}
  plug :scrub_params, "notification" when action in [:create, :update]
  @filtrex [
    %Config{type: :date, keys: ~w(inserted_at), options: %{format: "{YYYY}-{0M}-{0D}"}},
    %Config{type: :text, keys: ~w(type status)}
  ]

  @pagination [page_size: 10]
  @pagination_distance 5

  def index(conn, params, _, _) do
    params =
      params
      |> Map.put_new("sort_direction", "desc")
      |> Map.put_new("sort_field", "inserted_at")
    
    {:ok, sort_direction} = Map.fetch(params, "sort_direction")
    {:ok, sort_field} = Map.fetch(params, "sort_field")
    {:ok, filter} = Filtrex.parse_params(@filtrex, params["notification"] || %{})

    page =
      Notification
      |> Filtrex.query(filter)
      |> order_by(^sort(params))
      |> paginate(Repo, params, @pagination)

    render conn, "index.html",
      notifications: page.entries,
      page_number: page.page_number,
      page_size: page.page_size,
      total_pages: page.total_pages,
      total_entries: page.total_entries,
      distance: @pagination_distance,
      sort_field: sort_field,
      sort_direction: sort_direction
  end

  def new(conn, _params, _, _) do
    changeset = Notification.changeset(%Notification{})
    render conn, "new.html", changeset: changeset
  end

  def create(conn, %{"notification" => notification_params}, _, _) do
    changeset = Notification.changeset(%Notification{}, notification_params)

    case Repo.insert(changeset) do
      {:ok, _notification} ->
        conn
        |> put_flash(:info, "Notification created successfully.")
        |> redirect(to: admin_notification_path(conn, :index))
      {:error, changeset} ->
        conn
        |> put_status(400)
        |> render("new.html", changeset: changeset)
    end
  end

  def edit(conn, %{"id" => id}, _, _) do
    notification = Repo.get!(Notification, id)
    changeset = Notification.changeset(notification)
    render conn, "edit.html", changeset: changeset, notification: notification
  end

  def update(conn, %{"id" => id, "notification" => notification_params}, _, _) do
    notification = Repo.get!(Notification, id)
    changeset = Notification.changeset(notification, notification_params)

    case Repo.update(changeset) do
      {:ok, _notification} ->
        conn
        |> put_flash(:info, "Notification updated successfully.")
        |> redirect(to: admin_notification_path(conn, :index))
      {:error, changeset} ->
        conn
        |> put_status(400)
        |> render("edit.html", notification: notification, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}, _, _) do
    notification = Repo.get!(Notification, id)
    Repo.delete!(notification)

    conn
    |> put_flash(:info, "Notification deleted successfully.")
    |> redirect(to: admin_notification_path(conn, :index))
  end
end
