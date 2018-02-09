defmodule Danton.Admin.ClubController do
  use Danton.Web, :controller

  import Ecto.Query
  import Torch.Controller, only: [sort: 1, paginate: 4]

  alias Danton.Club
  alias Filtrex.Type.Config

  plug :put_layout, {Danton.LayoutView, "admin.html"}
  plug :scrub_params, "club" when action in [:create, :update]
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
    {:ok, filter} = Filtrex.parse_params(@filtrex, params["club"] || %{})

    page =
      Club
      |> Filtrex.query(filter)
      |> order_by(^sort(params))
      |> paginate(Repo, params, @pagination)

    render conn, "index.html",
      clubs: page.entries,
      page_number: page.page_number,
      page_size: page.page_size,
      total_pages: page.total_pages,
      total_entries: page.total_entries,
      distance: @pagination_distance,
      sort_field: sort_field,
      sort_direction: sort_direction
  end

  def new(conn, _params) do
    changeset = Club.changeset(%Club{})
    render conn, "new.html", changeset: changeset
  end

  def create(conn, %{"club" => club_params}) do
    changeset = Club.changeset(%Club{}, club_params)

    case Repo.insert(changeset) do
      {:ok, _club} ->
        conn
        |> put_flash(:info, "Club created successfully.")
        |> redirect(to: admin_club_path(conn, :index))
      {:error, changeset} ->
        conn
        |> put_status(400)
        |> render("new.html", changeset: changeset)
    end
  end

  def edit(conn, %{"id" => id}) do
    club = Repo.get!(Club, id)
    changeset = Club.changeset(club)
    render conn, "edit.html", changeset: changeset, club: club
  end

  def update(conn, %{"id" => id, "club" => club_params}) do
    club = Repo.get!(Club, id)
    changeset = Club.changeset(club, club_params)

    case Repo.update(changeset) do
      {:ok, _club} ->
        conn
        |> put_flash(:info, "Club updated successfully.")
        |> redirect(to: admin_club_path(conn, :index))
      {:error, changeset} ->
        conn
        |> put_status(400)
        |> render("edit.html", club: club, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    club = Repo.get!(Club, id)
    Repo.delete!(club)

    conn
    |> put_flash(:info, "Club deleted successfully.")
    |> redirect(to: admin_club_path(conn, :index))
  end
end
