defmodule Danton.ChannelController do
  use Danton.Web, :controller

  alias Danton.Channel
  plug Guardian.Plug.EnsureAuthenticated, handler: __MODULE__, typ: "access"

  def index(conn, %{"club_id" => club_id}, _current_user, _claims) do
    channels = Repo.all(
      from c in Channel,
      where: c.club_id == ^club_id,
      select: c
    )

    render(conn, "index.html", channels: channels, club_id: club_id)
  end

  def new(conn, %{"club_id" => club_id}, _current_user, _claims) do
    changeset = Channel.changeset(%Channel{})
    render(conn, "new.html", changeset: changeset, club_id: club_id)
  end

  def create(conn, %{"channel" => channel_params, "club_id" => club_id}, _current_user, _claims) do
    club = Danton.Repo.get(Danton.Club, club_id)

    # TODO: extract somehow
    %Danton.Channel{}
      |> Danton.Channel.changeset(channel_params)
      |> Ecto.Changeset.put_assoc(:club, club)
      |> Danton.Repo.insert()
      |> case do
      {:ok, _channel} ->
        conn
        |> put_flash(:info, "Channel created successfully.")
        |> redirect(to: club_channel_path(conn, :index, club_id))
      {:error, changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}, _current_user, _claims) do
    channel = Repo.get!(Channel, id) |> Repo.preload(:posts)
    render(conn, "show.html", channel: channel)
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
    club_id = channel.club_id

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(channel)

    conn
    |> put_flash(:info, "Channel deleted successfully.")
    |> redirect(to: club_channel_path(conn, :index, club_id))
  end

  # TODO: move this into a shared location
  def unauthenticated(conn, _params) do
    conn
    |> put_flash(:error, "Authentication required")
    |> redirect(to: auth_path(conn, :login))
  end
end
