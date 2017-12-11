defmodule Danton.ChannelController do
  use Danton.Web, :controller
  use Danton.CheckIn, :controller
  use Danton.Controller.Helpers, :no_items_rendering

  @page_size 20

  plug :check_in, :channel when action in [:show]

  plug Danton.WebAuthorization, [:channel, :view] when action in [:show]
  plug Danton.WebAuthorization, [:channel, :edit] when action in [:edit, :update, :delete]

  plug Guardian.Plug.EnsureAuthenticated, handler: __MODULE__, typ: "access"

  # ===========================
  # ACTIONS
  # ===========================

  def index(conn, params, current_user, _claims) do
    case index_template(current_user) do
      :no_clubs -> render_no_clubs(conn)
      :no_channels -> render_no_channels(conn)
      :no_posts -> render_no_posts(conn)
      :main -> render_channel_index(conn, params, current_user)
    end
  end

  defp render_channel_index(conn, params, current_user) do
    pagination_params = Map.merge(params, %{page_size: @page_size})
    page = Channel.for_user(current_user) |> Repo.paginate(pagination_params)

    channels = page.entries
      |> Repo.preload(:club)
      |> Channel.preload_post_counts()
      |> Channel.preload_most_recent_activity()

    render(conn, "index.html",
      channels: channels,
      club_id: nil,
      page_number: page.page_number,
      page_size: page.page_size,
      total_pages: page.total_pages,
      total_entries: page.total_entries
    )
  end

  def new(conn, %{"club_id" => club_id}, _current_user, _claims) do
    changeset = Channel.changeset(%Channel{})

    conn
    |> add_new_channel_crumbs(club_id)
    |> render("new.html", changeset: changeset, club_id: club_id, clubs: :empty)
  end

  def new(conn, _params, current_user, _claims) do
    changeset = Channel.changeset(%Channel{})
    clubs = Club.for_user(current_user) |> Repo.all

    conn
    |> add_new_channel_crumbs(:none)
    |> render("new.html", changeset: changeset, club_id: :none, clubs: clubs)
  end

  def create(conn, %{"channel" => channel_params, "club_id" => club_id}, _current_user, _claims) do
    create_and_respond(conn, %{"channel" => channel_params, "club_id" => club_id})
  end

  def create(conn, %{"channel" => channel_params}, current_user, _claims) do
    club_id = channel_params["club_id"]
    create_and_respond(conn, %{"channel" => channel_params, "club_id" => club_id, "current_user" => current_user})
  end

  defp create_and_respond(conn, %{"channel" => channel_params, "club_id" => club_id, "current_user" => current_user}) do
    club = Repo.get(Club, club_id)
    clubs = Club.for_user(current_user) |> Repo.all

    # TODO: extract somehow
    %Danton.Channel{}
      |> Channel.changeset(channel_params)
      |> Ecto.Changeset.put_assoc(:club, club)
      |> Repo.insert()
      |> case do
      {:ok, _channel} ->
        conn
        |> put_flash(:info, "Channel created successfully.")
        |> redirect(to: channel_path(conn, :index))
      {:error, changeset} ->
        conn
        |> put_flash(:error, "There was an issue creating this channel")
        |> add_new_channel_crumbs(club_id)
        |> render("new.html", changeset: changeset, club_id: :none, clubs: clubs)
    end
  end

  def show(conn, params = %{"id" => id}, _current_user, _claims) do
    channel = Repo.get!(Channel, id)
      |> Repo.preload(:posts)
      |> Repo.preload(:club)

    page = Post.for_channel_ids([channel.id])
      |> Post.by_activity()
      |> Repo.paginate(params)

    posts = page.entries |> Post.with_stream_preloads()

    conn
    |> add_club_crumb(channel.club_id)
    |> add_channel_crumb(channel)
    |> render(
      "show.html",
      channel: channel,
      club: channel.club,
      posts: posts,
      page_number: page.page_number,
      page_size: page.page_size,
      total_pages: page.total_pages,
      total_entries: page.total_entries
    )
  end

  def edit(conn, %{"id" => id}, _current_user, _claims) do
    channel = Repo.get!(Channel, id)
    changeset = Channel.changeset(channel)

    conn
    |> add_club_crumb(channel.club_id)
    |> add_channel_crumb(channel)
    |> add_channel_edit_crumb(channel)
    |> render("edit.html", channel: channel, changeset: changeset)
  end

  def update(conn, %{"id" => id, "channel" => channel_params}, _current_user, _claims) do
    channel = Repo.get!(Channel, id)
    changeset = Channel.changeset(channel, channel_params)

    case Repo.update(changeset) do
      {:ok, channel} ->
        conn
        |> put_flash(:info, "Channel updated successfully.")
        |> redirect(to: channel_path(conn, :show, channel))
      {:error, changeset} ->
        conn
        |> put_flash(:error, "There was an issue updating this channel")
        |> add_club_crumb(channel.club_id)
        |> add_channel_crumb(channel)
        |> add_channel_edit_crumb(channel)
        |> render("edit.html", channel: channel, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}, _current_user, _claims) do
    Channel.destroy(id)

    conn
    |> put_flash(:info, "Channel deleted successfully.")
    |> redirect(to: channel_path(conn, :index))
  end

  # BREADCRUMBS

  defp add_channels_crumb(conn) do
    add_breadcrumb(conn, name: "Channels", url: "/channels/")
  end

  defp add_channel_crumb(conn, channel) do
    add_breadcrumb(conn, name: channel.name, url: "/channels/" <> Integer.to_string(channel.id))
  end

  defp add_channel_edit_crumb(conn, channel) do
    add_breadcrumb(conn, name: "Edit", url: "/channels/" <> Integer.to_string(channel.id) <> "/edit")
  end

  defp add_club_crumb(conn, club_id) when is_integer(club_id) do
    club = Repo.get(Club, club_id)
    add_club_crumb(conn, club)
  end

  defp add_club_crumb(conn, club) do
    add_breadcrumb(conn, name: club.name, url: "/clubs/" <> Integer.to_string(club.id))
  end

  defp add_new_channel_crumbs(conn, club_id) when club_id == :none do
    conn
    |> add_channels_crumb()
    |> add_breadcrumb(name: "New Channel", url: "/channels/new")
  end

  defp add_new_channel_crumbs(conn, club_id) do
    conn
    |> add_club_crumb(String.to_integer(club_id))
    |> add_breadcrumb(name: "New Channel", url: "/clubs/" <> club_id <> "/channels/new")
  end
end
