defmodule Danton.Api.V1.ClubController do
  use Danton.Web, :controller

  # ===========================
  # ACTIONS
  # ===========================

  def index(conn, _params, current_user, _claims) do
    clubs = Club.for_user(current_user) |> Repo.all
    render(conn, "index.json", clubs: clubs)
  end

  def create(conn, %{"club" => club_params}, current_user, _claims) do
    changeset = Club.changeset(%Club{}, club_params)

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

  def show(conn, %{"id" => id}, _current_user, _claims) do
    club = Repo.get!(Club, id)
    render(conn, "show.json", club: club)
  end

  def update(conn, %{"id" => id, "club" => club_params}, _current_user, _claims) do
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

  def leave(conn, %{"club_id" => club_id}, current_user, _claims) do
    membership = Membership.for_user(current_user) |> Repo.get_by(club_id: club_id)

    if membership do
      # Here we use delete! (with a bang) because we expect
      # it to always work (and if it does not, it will raise).
      Repo.delete!(membership)
      json conn, %{successful: true, id: membership.id}
    else
      conn
      |> put_status(:unprocessable_entity)
      |> json(%{successful: false})
    end
  end

  def delete(conn, %{"id" => id}, current_user, _claims) do
    club = Repo.get!(Club, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(club)

    send_resp(conn, :no_content, "")
  end
end
