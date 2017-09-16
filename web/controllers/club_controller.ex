defmodule Danton.ClubController do
  use Danton.Web, :controller

  plug Guardian.Plug.EnsureAuthenticated, handler: __MODULE__, typ: "access"

  # ===========================
  # ACTIONS
  # ===========================


  def index(conn, _params, current_user, _claims) do
    clubs = current_user
      |> Ecto.assoc(:clubs)
      |> Repo.all

    render(conn, "index.html", clubs: clubs)
  end

  def new(conn, _params, _current_user, _claims) do
    changeset = Club.changeset(%Club{})
    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{"club" => club_params}, _current_user, _claims) do
    changeset = Club.changeset(%Club{}, club_params)

    case Repo.insert(changeset) do
      {:ok, _club} ->
        conn
        |> put_flash(:info, "Club created successfully.")
        |> redirect(to: club_path(conn, :index))
      {:error, changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}, _current_user, _claims) do
    club = Repo.get!(Club, id) |> Repo.preload(:channels)
    render(conn, "show.html", club: club)
  end

  def edit(conn, %{"id" => id}, _current_user, _claims) do
    club = Repo.get!(Club, id)
    changeset = Club.changeset(club)
    render(conn, "edit.html", club: club, changeset: changeset)
  end

  def update(conn, %{"id" => id, "club" => club_params}, _current_user, _claims) do
    club = Repo.get!(Club, id)
    changeset = Club.changeset(club, club_params)

    case Repo.update(changeset) do
      {:ok, club} ->
        conn
        |> put_flash(:info, "Club updated successfully.")
        |> redirect(to: club_path(conn, :show, club))
      {:error, changeset} ->
        render(conn, "edit.html", club: club, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}, _current_user, _claims) do
    club = Repo.get!(Club, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(club)

    conn
    |> put_flash(:info, "Club deleted successfully.")
    |> redirect(to: club_path(conn, :index))
  end

  # TODO: move this into a shared location
  def unauthenticated(conn, _params) do
    conn
    |> put_flash(:error, "Authentication required")
    |> redirect(to: auth_path(conn, :login))
  end
end
