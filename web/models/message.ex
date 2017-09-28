defmodule Danton.Message do
  use Danton.Web, :model

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

  def for_room(query \\ Message, room_id) do
    from m in query, where: m.room_id == ^room_id
  end

  def for_post(post_id) do
    Room.for_and_with_post(post_id) |> Ecto.assoc(:messages)
  end

  # ===========================
  # GETTERS
  # ===========================

  def latest_for_post(post) do
    post.room.messages
      |> Enum.sort(&(&1.inserted_at >= &2.inserted_at))
      |> List.first()
  end

  def count_for_post(post) do
    length(post.room.messages)
  end

  # ===========================
  # OTHER
  # ===========================

  def create_message_for_room(room, message_params) do
    cs = Ecto.build_assoc(room, :messages, message_params)
    message = Repo.insert!(cs)
    Task.start( __MODULE__, :notify_users, [message] )
    message
  end

  # TODO: move logic elsewhere?
  def notify_users(message) do
    seconds_to_sleep = 20
    :timer.sleep(seconds_to_sleep * 1000)

    users_for_room = Enum.map(
      Repo.all(User.for_room(message.room_id)),
      &(&1.id)
    )

    users_checked_in = CheckIn.users_checked_in_since(
      message.inserted_at, %{id: message.room_id, type: :room}
    )

    user_who_sent = [message.user_id]
    users_to_ignore = users_checked_in ++ user_who_sent
    users_to_send_to = users_for_room -- users_to_ignore

    Danton.Notification.notify_users(users_to_send_to, :new_chat_message, %{message: message})
  end
end
