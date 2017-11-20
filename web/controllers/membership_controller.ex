defmodule Danton.MembershipController do
  use Danton.Web, :controller

  plug Guardian.Plug.EnsureAuthenticated, handler: __MODULE__, typ: "access"

  # ===========================
  # ACTIONS
  # ===========================

  def index(conn, params = %{"club_id" => club_id}, current_user, _claims) do
    club = Repo.get(Club, club_id)
    memberships = Membership.for_club(club_id)
      |> Repo.all()
      |> Repo.preload(:user)

    render(conn, "index.html", memberships: memberships, club: club)
  end

  def new(conn, params = %{"club_id" => club_id}, _current_user, _claims) do
    club = Repo.get(Club, club_id)
    changeset = Membership.changeset(%Danton.Membership{})
    render(conn, "new.html", changeset: changeset, club: club)
  end

  def create(conn, %{"membership" => membership_params, "club_id" => club_id}, _current_user, _claims) do
    club = Repo.get(Club, club_id)

    cs = Membership.changeset(
      %Danton.Membership{status: "pending"},
      membership_params
    ) |> Ecto.Changeset.put_assoc(:club, club)

    case Membership.invite_and_notify(cs) do
      {:ok, _membership} ->
        conn
        |> put_flash(:info, "User Invited.")
        |> redirect(to: club_membership_path(conn, :index, club_id))
      {:error, changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}, _current_user, _claims) do
    membership = Repo.get!(Membership, id)
    render(conn, "show.html", membership: membership)
  end

  def edit(conn, %{"id" => id}, _current_user, _claims) do
    membership = Repo.get!(Membership, id)
    changeset = Membership.changeset(membership)
    render(conn, "edit.html", membership: membership, changeset: changeset)
  end

  def update(conn, %{"id" => id, "membership" => membership_params}, _current_user, _claims) do
    membership = Repo.get!(Membership, id)
    changeset = Membership.changeset(membership, membership_params)

    case Repo.update(changeset) do
      {:ok, membership} ->
        conn
        |> put_flash(:info, "Membership updated successfully.")
        |> redirect(to: membership_path(conn, :show, membership))
      {:error, changeset} ->
        render(conn, "edit.html", membership: membership, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}, _current_user, _claims) do
    membership = Repo.get!(Membership, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(membership)

    conn
    |> put_flash(:info, "Membership deleted successfully.")
    |> redirect(to: membership_path(conn, :index))
  end
end
