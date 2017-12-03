defmodule Danton.ClubController do
  use Danton.Web, :controller
  use Danton.Controller.Helpers, :no_items_rendering

  plug Danton.WebAuthorization, [:club, :view] when action in [:show, :leave]
  plug Danton.WebAuthorization, [:club, :edit] when action in [:edit, :update, :delete]

  plug Guardian.Plug.EnsureAuthenticated, handler: __MODULE__, typ: "access"

  plug :add_breadcrumb, name: "Clubs", url: "/clubs"

  # ===========================
  # ACTIONS
  # ===========================

  def index(conn, params, current_user, _claims) do
    case index_template(current_user) do
      :no_clubs -> render_no_clubs(conn)
      :no_channels -> render_no_channels(conn)
      :no_posts -> render_no_posts(conn)
      :main -> render_club_index(conn, params, current_user)
    end
  end

  defp render_club_index(conn, params, current_user) do
    page = current_user
      |> Ecto.assoc(:clubs)
      |> order_by(asc: :inserted_at)
      |> Repo.paginate(params)

    clubs = page.entries
      |> Club.preload_channel_counts()
      |> Club.preload_post_counts()
      |> Club.preload_most_recent_activity()

    render(conn,
      "index.html",
      clubs: clubs,
      user: current_user,
      page_number: page.page_number,
      page_size: page.page_size,
      total_pages: page.total_pages,
      total_entries: page.total_entries
    )
  end

  def new(conn, _params, _current_user, _claims) do
    changeset = Club.changeset(%Club{})

    conn
    |> add_new_club_crumb()
    |> render("new.html", changeset: changeset)
  end

  def create(conn, %{"club" => club_params}, current_user, _claims) do
    changeset = Club.changeset(%Club{}, club_params)

    case Repo.insert(changeset) do
      {:ok, club} ->
        # TODO: pull this out somewhere
        Club.make_admin(club, current_user)

        conn
        |> put_flash(:info, "Club created successfully.")
        |> redirect(to: club_path(conn, :index))
      {:error, changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end

  def show(conn, params = %{"id" => id}, _current_user, _claims) do
    club = Repo.get!(Club, id) |> Repo.preload(:channels)
    channels = club.channels |> Repo.preload(:club)

    page = Post.for_club(club)
      |> Post.by_activity()
      |> Repo.paginate(params)

    posts = page.entries |> Post.with_stream_preloads()

    conn
    |> add_club_crumb(club)
    |> render(
      "show.html",
      club: club,
      channels: channels,
      posts: posts,
      page_number: page.page_number,
      page_size: page.page_size,
      total_pages: page.total_pages,
      total_entries: page.total_entries
    )
  end

  def edit(conn, %{"id" => id}, _current_user, _claims) do
    club = Repo.get!(Club, id)
    changeset = Club.changeset(club)

    conn
    |> add_club_crumb(club)
    |> add_edit_club_crumb(club)
    |> render("edit.html", club: club, changeset: changeset)
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

  def leave(conn, %{"club_id" => club_id}, current_user, _claims) do
    membership = Membership.for_user(current_user) |> Repo.get_by(club_id: club_id)
    if membership do
      # Here we use delete! (with a bang) because we expect
      # it to always work (and if it does not, it will raise).
      Repo.delete!(membership)
      conn
      |> put_flash(:info, "You have left the club.")
      |> redirect(to: club_path(conn, :index))
    end
  end

  # BREADCRUMBS

  defp add_club_crumb(conn, club) do
    add_breadcrumb(conn, name: club.name, url: "/clubs/" <> Integer.to_string(club.id))
  end

  defp add_new_club_crumb(conn) do
    add_breadcrumb(conn, name: "New Club", url: "/clubs/new")
  end

  defp add_edit_club_crumb(conn, club) do
    add_breadcrumb(conn, name: "Edit", url: "/clubs/" <> Integer.to_string(club.id) <> "/edit")
  end
end
