defmodule Danton.ChannelController do
  use Danton.Web, :controller
  use Danton.CheckIn, :controller

  plug :check_in, :channel when action in [:show]

  plug Danton.WebAuthorization, [:channel, :view] when action in [:show]
  plug Danton.WebAuthorization, [:channel, :edit] when action in [:edit, :update, :delete]

  plug Guardian.Plug.EnsureAuthenticated, handler: __MODULE__, typ: "access"

  # ===========================
  # ACTIONS
  # ===========================

  def index(conn, params = %{"club_id" => club_id}, _current_user, _claims) do
    page = Channel.for_club(club_id) |> Repo.paginate(params)
    channels = page.entries |> Repo.preload(:club)

    render(conn, "index.html",
      channels: channels,
      club_id: club_id,
      page_number: page.page_number,
      page_size: page.page_size,
      total_pages: page.total_pages,
      total_entries: page.total_entries
    )
  end

  def index(conn, params, current_user, _claims) do
    page = Channel.for_user(current_user) |> Repo.paginate(params)
    channels = page.entries |> Repo.preload(:club)

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
    render(conn, "new.html", changeset: changeset, club_id: club_id, clubs: :empty)
  end

  def new(conn, _params, current_user, _claims) do
    changeset = Channel.changeset(%Channel{})
    clubs = Club.for_user(current_user) |> Repo.all
    render(conn, "new.html", changeset: changeset, club_id: :none, clubs: clubs)
  end

  def create(conn, %{"channel" => channel_params, "club_id" => club_id}, _current_user, _claims) do
    create_and_respond(conn, %{"channel" => channel_params, "club_id" => club_id})
  end

  def create(conn, %{"channel" => channel_params}, _current_user, _claims) do
    club_id = channel_params["club_id"]
    create_and_respond(conn, %{"channel" => channel_params, "club_id" => club_id})
  end

  defp create_and_respond(conn, %{"channel" => channel_params, "club_id" => club_id}) do
    club = Repo.get(Club, club_id)

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
        render(conn, "new.html", changeset: changeset)
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

    render(conn,
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
    render(conn, "edit.html", channel: channel, changeset: changeset)
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
        render(conn, "edit.html", channel: channel, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}, _current_user, _claims) do
    channel = Repo.get!(Channel, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(channel)

    conn
    |> put_flash(:info, "Channel deleted successfully.")
    |> redirect(to: channel_path(conn, :index))
  end
end
