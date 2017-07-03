defmodule Danton.Api.V1.MembershipController do
  use Danton.Web, :controller

  alias Danton.Membership

  def index(conn, _params) do

    # TODO: replace once mobile app handles users
    # current_user = Coherence.current_user(conn)

    current_user = Repo.get(Danton.User, 1)
    memberships = current_user
      |> Ecto.assoc(:memberships)
      |> Repo.all
		render(conn, "index.json", memberships: memberships)
  end

  # TODO add proper relationship login
  def create(conn, %{"membership" => membership_params}) do
    changeset = Membership.changeset(%Membership{status: "pending"}, membership_params)

    case Repo.insert(changeset) do
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

  def show(conn, %{"id" => id}) do
    membership = Repo.get!(Membership, id)
    render(conn, "show.json", membership: membership)
  end

  def update(conn, %{"id" => id, "membership" => membership_params}) do
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

  def delete(conn, %{"id" => id}) do
    membership = Repo.get!(Membership, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(membership)

    send_resp(conn, :no_content, "")
  end
end
