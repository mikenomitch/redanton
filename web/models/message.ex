defmodule Danton.Message do
  use Danton.Web, :model

  alias Danton.Repo
  alias Danton.CheckIn
  alias Danton.Notification
  alias Danton.Room
  alias Danton.User

  # ===========================
  # ECTO CONFIG
  # ===========================

  schema "messages" do
    field :body, :string
    belongs_to :room, Room
    belongs_to :user, User

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:body])
    |> validate_required([:body])
  end

  # ===========================
  # QUERIES
  # ===========================

  # TODO: SPLIT OUT ECTO QUERIES

  # ===========================
  # OTHER
  # ===========================

  def create_message_for_room(room, message_params) do
    cs = Ecto.build_assoc(room, :messages, message_params)
    message = Repo.insert!(cs)
    Task.start(__MODULE__, :notify_users, [message])
    message
  end

  # TODO: this logic should go elsewhere?
  def notify_users(message) do
    seconds_to_sleep = 20
    :timer.sleep(seconds_to_sleep * 1000)

    users_for_room = Enum.map(Room.users_for_room(message.room_id), &(&1.id))
    users_checked_in = CheckIn.users_checked_in_since(
      message.inserted_at, %{id: message.room_id, type: :room}
    )
    user_who_sent = [message.user_id]
    users_to_ignore = users_checked_in ++ user_who_sent
    users_to_send_to = users_for_room -- users_to_ignore


    Notification.notify_users(users_to_send_to, %{type: :new_chat_message, value: message})
  end
end
