defmodule Danton.Api.V1.MembershipController do
  use Danton.Web, :controller

  # ===========================
  # ACTIONS
  # ===========================

  def index(conn, %{"club_id" => club_id}, _current_user, _claims) do
    memberships = Repo.get(Club, club_id)
    |> Membership.for_club()
    |> Repo.all()
		render(conn, "index.json", memberships: memberships)
  end

  def index(conn, _params, current_user, _claims) do
    memberships = Membership.for_user(current_user) |> Repo.all()
    render(conn, "index.json", memberships: memberships)
  end

  def create(conn, %{"email" => email, "club_id" => club_id}, _current_user, _claims) do
    user = User.get_or_create_by_email(email)
    club = Repo.get(Club, club_id)
    membership_params = %{club: club, type: "standard", status: "pending", email: email}

    cs = Ecto.build_assoc(user, :memberships, membership_params)

    create_and_respond(conn, cs)
  end

  defp create_and_respond(conn, cs) do
    case Membership.invite_and_notify(cs) do
      {:ok, membership} ->
        conn
        |> put_status(:created)
        |> put_resp_header("location", membership_path(conn, :show, membership))
        |> render("show.json", membership: membership)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Danton.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}, _current_user, _claims) do
    membership = Repo.get!(Membership, id)
    render(conn, "show.json", membership: membership)
  end

  def update(conn, %{"id" => id, "membership" => membership_params}, _current_user, _claims) do
    membership = Repo.get!(Membership, id)
    changeset = Membership.changeset(membership, membership_params)

    case Repo.update(changeset) do
      {:ok, membership} ->
        render(conn, "show.json", membership: membership)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Danton.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}, _current_user, _claims) do
    membership = Repo.get!(Membership, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(membership)

    send_resp(conn, :no_content, "")
  end
end
