defmodule Danton.Admin.ChannelController do
  use Danton.Web, :controller

  import Ecto.Query
  import Torch.Controller, only: [sort: 1, paginate: 4]

  alias Danton.Channel
  alias Filtrex.Type.Config

  plug :put_layout, {Danton.LayoutView, "admin.html"}
  plug :scrub_params, "channel" when action in [:create, :update]
  @filtrex [
    %Config{type: :date, keys: ~w(inserted_at), options: %{format: "{YYYY}-{0M}-{0D}"}},
    %Config{type: :text, keys: ~w(name description)}
  ]

  @pagination [page_size: 10]
  @pagination_distance 5

  def index(conn, params) do
    params =
      params
      |> Map.put_new("sort_direction", "desc")
      |> Map.put_new("sort_field", "inserted_at")

      {:ok, sort_direction} = Map.fetch(params, "sort_direction")
    {:ok, sort_field} = Map.fetch(params, "sort_field")
    {:ok, filter} = Filtrex.parse_params(@filtrex, params["channel"] || %{})

    page =
      Channel
      |> Filtrex.query(filter)
      |> order_by(^sort(params))
      |> paginate(Repo, params, @pagination)

    render conn, "index.html",
      channels: page.entries,
      page_number: page.page_number,
      page_size: page.page_size,
      total_pages: page.total_pages,
      total_entries: page.total_entries,
      distance: @pagination_distance,
      sort_field: sort_field,
      sort_direction: sort_direction
  end

  def new(conn, _params) do
    changeset = Channel.changeset(%Channel{})
    render conn, "new.html", changeset: changeset
  end

  def create(conn, %{"channel" => channel_params}) do
    changeset = Channel.changeset(%Channel{}, channel_params)

    case Repo.insert(changeset) do
      {:ok, _channel} ->
        conn
        |> put_flash(:info, "Tag created successfully.")
        |> redirect(to: admin_channel_path(conn, :index))
      {:error, changeset} ->
        conn
        |> put_status(400)
        |> render("new.html", changeset: changeset)
    end
  end

  def edit(conn, %{"id" => id}) do
    channel = Repo.get!(Channel, id)
    changeset = Channel.changeset(channel)
    render conn, "edit.html", changeset: changeset, channel: channel
  end

  def update(conn, %{"id" => id, "channel" => channel_params}) do
    channel = Repo.get!(Channel, id)
    changeset = Channel.changeset(channel, channel_params)

    case Repo.update(changeset) do
      {:ok, _channel} ->
        conn
        |> put_flash(:info, "Tag updated successfully.")
        |> redirect(to: admin_channel_path(conn, :index))
      {:error, changeset} ->
        conn
        |> put_status(400)
        |> render("edit.html", channel: channel, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    channel = Repo.get!(Channel, id)
    Repo.delete!(channel)

    conn
    |> put_flash(:info, "Tag deleted successfully.")
    |> redirect(to: admin_channel_path(conn, :index))
  end
end
