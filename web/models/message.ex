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

  def for_user(query \\ Message, user_id) when is_number(user_id) do
    from m in query, where: m.user_id == ^user_id
  end

  def for_room(query \\ Message, room_id) when is_number(room_id) do
    from m in query, where: m.room_id == ^room_id
  end

  def for_post(query \\ Post, post_id) when is_number(post_id) do
    Room.for_and_with_post(post_id) |> Ecto.assoc(:messages)
  end

  def count_distinct(query \\ Post) do
    from p in query, select: count(p.id, :distinct)
  end

  def ordered_by_latest(query \\ Post) do
    from q in query, order_by: [desc: :inserted_at]
  end

  def ordered_by_earliest(query \\ Post) do
    from q in query, order_by: [asc: :inserted_at]
  end

  def get_first(query \\ Post) do
    query |> limit(1)
  end

  # ===========================
  # GETTERS
  # ===========================

  def latest_for_post(post) do
    for_post(post.id)
    |> ordered_by_latest()
    |> get_first()
    |> Repo.one()
  end

  def count_for_post(post) do
    for_post(post.id)
    |> count_distinct()
    |> Repo.one()
  end

  # ===========================
  # OTHER
  # ===========================

  def create_message_for_room(room, message_params, skip_notification \\ false) do
    cs = Ecto.build_assoc(room, :messages, message_params)
    message = Repo.insert!(cs)
    Post.update_activity_for_message!(message)

    unless skip_notification do
      Task.start( __MODULE__, :notify_users, [message])
    end

    message
  end

  def notify_users(message) do
    seconds_to_sleep = 5
    :timer.sleep(seconds_to_sleep * 1000)

    users_for_room = Room.user_ids_for_room(message.room_id)

    users_checked_in = CheckIn.users_checked_in_since(
      message.inserted_at,
      %{id: message.room_id, type: :room}
    )

    user_who_sent = [message.user_id]
    users_to_ignore = users_checked_in ++ user_who_sent
    users_to_send_to = users_for_room -- users_to_ignore

    sender = User.for_message(message) |> Repo.one()
    post = Post.for_message(message) |> Repo.one()

    Danton.Communication.notify_users(
      users_to_send_to,
      :new_chat_message,
      %{
        sender_name: sender.name || sender.email,
        post_title: post.title,
        post_path: "/posts/#{post.id}",
        post_id: post.id
      }
    )
  end
end
