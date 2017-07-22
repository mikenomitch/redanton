defmodule Danton.MembershipController do
  use Danton.Web, :controller

  alias Danton.Membership

  def index(conn, _params) do
    # TODO: replace once mobile app handles users
    current_user = Repo.get(Danton.User, 1)

    memberships = current_user
      |> Ecto.assoc(:memberships)
      |> Repo.all

    render(conn, "index.html", memberships: memberships)
  end

  def new(conn, _params) do
    changeset = Membership.changeset(%Membership{})
    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{"membership" => membership_params}) do
    changeset = Membership.changeset(%Membership{}, membership_params)

    case Repo.insert(changeset) do
      {:ok, _membership} ->
        conn
        |> put_flash(:info, "Membership created successfully.")
        |> redirect(to: membership_path(conn, :index))
      {:error, changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    membership = Repo.get!(Membership, id)
    render(conn, "show.html", membership: membership)
  end

  def edit(conn, %{"id" => id}) do
    membership = Repo.get!(Membership, id)
    changeset = Membership.changeset(membership)
    render(conn, "edit.html", membership: membership, changeset: changeset)
  end

  def update(conn, %{"id" => id, "membership" => membership_params}) do
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

  def delete(conn, %{"id" => id}) do
    membership = Repo.get!(Membership, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(membership)

    conn
    |> put_flash(:info, "Membership deleted successfully.")
    |> redirect(to: membership_path(conn, :index))
  end
end
