defmodule Danton.Admin.MessageController do
  use Danton.Web, :controller

  import Ecto.Query
  import Torch.Controller, only: [sort: 1, paginate: 4]

  alias Danton.Message
  alias Filtrex.Type.Config

  plug :put_layout, {Danton.LayoutView, "admin.html"}
  plug :scrub_params, "message" when action in [:create, :update]
  @filtrex [
    %Config{type: :date, keys: ~w(inserted_at), options: %{format: "{YYYY}-{0M}-{0D}"}},
    %Config{type: :text, keys: ~w(body)}
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
    {:ok, filter} = Filtrex.parse_params(@filtrex, params["message"] || %{})

    page =
      Message
      |> Filtrex.query(filter)
      |> order_by(^sort(params))
      |> paginate(Repo, params, @pagination)

    render conn, "index.html",
      messages: page.entries,
      page_number: page.page_number,
      page_size: page.page_size,
      total_pages: page.total_pages,
      total_entries: page.total_entries,
      distance: @pagination_distance,
      sort_field: sort_field,
      sort_direction: sort_direction
  end

  def new(conn, _params, _, _) do
    changeset = Message.changeset(%Message{})
    render conn, "new.html", changeset: changeset
  end

  def create(conn, %{"message" => message_params}, _, _) do
    changeset = Message.changeset(%Message{}, message_params)

    case Repo.insert(changeset) do
      {:ok, _message} ->
        conn
        |> put_flash(:info, "Message created successfully.")
        |> redirect(to: admin_message_path(conn, :index))
      {:error, changeset} ->
        conn
        |> put_status(400)
        |> render("new.html", changeset: changeset)
    end
  end

  def edit(conn, %{"id" => id}, _, _) do
    message = Repo.get!(Message, id)
    changeset = Message.changeset(message)
    render conn, "edit.html", changeset: changeset, message: message
  end

  def update(conn, %{"id" => id, "message" => message_params}, _, _) do
    message = Repo.get!(Message, id)
    changeset = Message.changeset(message, message_params)

    case Repo.update(changeset) do
      {:ok, _message} ->
        conn
        |> put_flash(:info, "Message updated successfully.")
        |> redirect(to: admin_message_path(conn, :index))
      {:error, changeset} ->
        conn
        |> put_status(400)
        |> render("edit.html", message: message, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}, _, _) do
    message = Repo.get!(Message, id)
    Repo.delete!(message)

    conn
    |> put_flash(:info, "Message deleted successfully.")
    |> redirect(to: admin_message_path(conn, :index))
  end
end
