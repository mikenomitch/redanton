defmodule Danton.Api.V1.ChannelController do
  use Danton.Web, :controller

  alias Danton.Channel

  def index(conn, %{"club_id" => club_id}, _current_user, _claims) do
    channels = Repo.all(
      from c in Channel,
      where: c.club_id == ^club_id,
      select: c
    )

    render_index(conn, channels)
  end

  # Top level index without a specific club
  def index(conn, _params, current_user, _claims) do
		channels = Danton.User.clubs_for_user(current_user)
			|> Danton.Club.channels_for_clubs

    render_index(conn, channels)
  end

  defp render_index(conn, channels) do
    render(conn, "index.json", channels: channels)
  end

  # TODO: add proper relationship logic
  def create(conn, %{"channel" => channel_params, "club_id" => club_id}, _current_user, _claims) do
    club = Danton.Repo.get(Danton.Club, club_id)
    # TODO: extract somehow
    %Channel{}
      |> Channel.changeset(channel_params)
      |> Ecto.Changeset.put_assoc(:club, club)
      |> Danton.Repo.insert()
      |> case do
      {:ok, channel} ->
        conn
        |> put_status(:created)
        |> put_resp_header("location", channel_path(conn, :show, channel))
        |> render("show.json", channel: channel)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Danton.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}, _current_user, _claims) do
    channel = Repo.get!(Channel, id)
    render(conn, "show.json", channel: channel)
  end

  def update(conn, %{"id" => id, "channel" => channel_params}, _current_user, _claims) do
    channel = Repo.get!(Channel, id)
    changeset = Channel.changeset(channel, channel_params)

    case Repo.update(changeset) do
      {:ok, channel} ->
        render(conn, "show.json", channel: channel)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Danton.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}, _current_user, _claims) do
    Channel.destroy(id)
    send_resp(conn, :no_content, "")
  end
end
