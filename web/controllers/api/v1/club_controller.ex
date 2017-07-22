defmodule Danton.Api.V1.ClubController do
  use Danton.Web, :controller

  alias Danton.Club

  def index(conn, _params) do
    # TODO: replace once mobile app handles users
    current_user = Repo.get(Danton.User, 1)

    clubs = current_user
      |> Ecto.assoc(:clubs)
      |> Repo.all

    render(conn, "index.json", clubs: clubs)
  end

  def create(conn, %{"club" => club_params}) do
    changeset = Club.changeset(%Club{}, club_params)

    # TODO: replace once mobile app handles users
    current_user = Repo.get(Danton.User, 1)

    case Repo.insert(changeset) do
      {:ok, club} ->
        # TODO: pull this out somewhere?
        Club.make_admin(club, current_user)

        conn
        |> put_status(:created)
        |> put_resp_header("location", club_path(conn, :show, club))
        |> render("show.json", club: club)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Danton.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    club = Repo.get!(Club, id)
    render(conn, "show.json", club: club)
  end

  def update(conn, %{"id" => id, "club" => club_params}) do
    club = Repo.get!(Club, id)
    changeset = Club.changeset(club, club_params)

    case Repo.update(changeset) do
      {:ok, club} ->
        render(conn, "show.json", club: club)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Danton.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    club = Repo.get!(Club, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(club)

    send_resp(conn, :no_content, "")
  end
end
