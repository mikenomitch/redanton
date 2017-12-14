defmodule Danton.Admin.MembershipController do
  use Danton.Web, :controller

  import Ecto.Query
  import Torch.Controller, only: [sort: 1, paginate: 4]

  alias Danton.Membership
  alias Filtrex.Type.Config

  plug :put_layout, {Danton.LayoutView, "admin.html"}
  plug :scrub_params, "membership" when action in [:create, :update]
  @filtrex [
    %Config{type: :date, keys: ~w(inserted_at), options: %{format: "{YYYY}-{0M}-{0D}"}},
    %Config{type: :text, keys: ~w(status type email)}
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
    {:ok, filter} = Filtrex.parse_params(@filtrex, params["membership"] || %{})

    page =
      Membership
      |> Filtrex.query(filter)
      |> order_by(^sort(params))
      |> paginate(Repo, params, @pagination)

    render conn, "index.html",
      memberships: page.entries,
      page_number: page.page_number,
      page_size: page.page_size,
      total_pages: page.total_pages,
      total_entries: page.total_entries,
      distance: @pagination_distance,
      sort_field: sort_field,
      sort_direction: sort_direction
  end

  def new(conn, _params, _, _) do
    changeset = Membership.changeset(%Membership{})
    render conn, "new.html", changeset: changeset
  end

  def create(conn, %{"membership" => membership_params}, _, _) do
    changeset = Membership.changeset(%Membership{}, membership_params)

    case Repo.insert(changeset) do
      {:ok, _membership} ->
        conn
        |> put_flash(:info, "Membership created successfully.")
        |> redirect(to: admin_membership_path(conn, :index))
      {:error, changeset} ->
        conn
        |> put_status(400)
        |> render("new.html", changeset: changeset)
    end
  end

  def edit(conn, %{"id" => id}, _, _) do
    membership = Repo.get!(Membership, id)
    changeset = Membership.changeset(membership)
    render conn, "edit.html", changeset: changeset, membership: membership
  end

  def update(conn, %{"id" => id, "membership" => membership_params}, _, _) do
    membership = Repo.get!(Membership, id)
    changeset = Membership.changeset(membership, membership_params)

    case Repo.update(changeset) do
      {:ok, _membership} ->
        conn
        |> put_flash(:info, "Membership updated successfully.")
        |> redirect(to: admin_membership_path(conn, :index))
      {:error, changeset} ->
        conn
        |> put_status(400)
        |> render("edit.html", membership: membership, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}, _, _) do
    membership = Repo.get!(Membership, id)
    Repo.delete!(membership)

    conn
    |> put_flash(:info, "Membership deleted successfully.")
    |> redirect(to: admin_membership_path(conn, :index))
  end
end
