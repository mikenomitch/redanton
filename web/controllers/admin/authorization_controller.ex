defmodule Danton.Admin.AuthorizationController do
  use Danton.Web, :controller

  import Ecto.Query
  import Torch.Controller, only: [sort: 1, paginate: 4]

  alias Danton.Authorization
  alias Filtrex.Type.Config

  plug :put_layout, {Danton.LayoutView, "admin.html"}
  plug :scrub_params, "authorization" when action in [:create, :update]
  @filtrex [
    %Config{type: :text, keys: ~w(provider uid token refresh_token)}
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
    {:ok, filter} = Filtrex.parse_params(@filtrex, params["authorization"] || %{})

    page =
      Authorization
      |> Filtrex.query(filter)
      |> order_by(^sort(params))
      |> paginate(Repo, params, @pagination)

    render conn, "index.html",
      authorizations: page.entries,
      page_number: page.page_number,
      page_size: page.page_size,
      total_pages: page.total_pages,
      total_entries: page.total_entries,
      distance: @pagination_distance,
      sort_field: sort_field,
      sort_direction: sort_direction
  end

  def new(conn, _params) do
    changeset = Authorization.changeset(%Authorization{})
    render conn, "new.html", changeset: changeset
  end

  def create(conn, %{"authorization" => authorization_params}) do
    changeset = Authorization.changeset(%Authorization{}, authorization_params)

    case Repo.insert(changeset) do
      {:ok, _authorization} ->
        conn
        |> put_flash(:info, "Authorization created successfully.")
        |> redirect(to: admin_authorization_path(conn, :index))
      {:error, changeset} ->
        conn
        |> put_status(400)
        |> render("new.html", changeset: changeset)
    end
  end

  def edit(conn, %{"id" => id}) do
    authorization = Repo.get!(Authorization, id)
    changeset = Authorization.changeset(authorization)
    render conn, "edit.html", changeset: changeset, authorization: authorization
  end

  def update(conn, %{"id" => id, "authorization" => authorization_params}) do
    authorization = Repo.get!(Authorization, id)
    changeset = Authorization.changeset(authorization, authorization_params)

    case Repo.update(changeset) do
      {:ok, _authorization} ->
        conn
        |> put_flash(:info, "Authorization updated successfully.")
        |> redirect(to: admin_authorization_path(conn, :index))
      {:error, changeset} ->
        conn
        |> put_status(400)
        |> render("edit.html", authorization: authorization, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    authorization = Repo.get!(Authorization, id)
    Repo.delete!(authorization)

    conn
    |> put_flash(:info, "Authorization deleted successfully.")
    |> redirect(to: admin_authorization_path(conn, :index))
  end
end
