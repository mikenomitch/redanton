defmodule Danton.Api.V1.ChannelController do
  use Danton.Web, :controller

  alias Danton.Channel

  def index(conn, %{"club_id" => club_id}) do
    channels = Repo.all(
      from c in Channel,
      where: c.club_id == ^club_id,
      select: c
    )

    render_index(conn, channels)
  end

  # Top level index without a specific club
  def index(conn, _params) do
    # TODO: replace once mobile can handle users
    current_user = Repo.get(Danton.User, 1)

    clubs = Repo.all Ecto.assoc(current_user, :clubs)
    channels = Repo.all Ecto.assoc(clubs, :channels)

    render_index(conn, channels)
  end

  defp render_index(conn, channels) do
    render(conn, "index.json", channels: channels)
  end

  # TODO: add proper relationship logic
  def create(conn, %{"channel" => channel_params}) do
    changeset = Channel.changeset(%Channel{}, channel_params)

    case Repo.insert(changeset) do
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

  def show(conn, %{"id" => id}) do
    channel = Repo.get!(Channel, id)
    render(conn, "show.json", channel: channel)
  end

  def update(conn, %{"id" => id, "channel" => channel_params}) do
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

  def delete(conn, %{"id" => id}) do
    channel = Repo.get!(Channel, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(channel)

    send_resp(conn, :no_content, "")
  end
end
