defmodule Danton.Post do
  use Danton.Web, :model

  # ===========================
  # ECTO CONFIG
  # ===========================

  schema "posts" do
    field :title, :string
    field :description, :string
    field :type, :string
    field :url, :string
    field :activity_at, Ecto.DateTime
    belongs_to :channel, Channel
    belongs_to :user, User
    has_one :room, Room
    many_to_many :messages, Message, join_through: "room"

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:title, :description, :type, :url, :activity_at])
    |> validate_required([:title])
  end

  # ===========================
  # QUERIES
  # ===========================

  @doc """
  gets all the channels for a list of clubs
  """
  def for_channel_ids(query \\ Post, channel_ids) do
    from(p in query, where: p.channel_id in ^channel_ids)
  end

  def for_channel_stream(channel_id) do
    for_channel_ids([channel_id]) |> with_stream_preloads()
  end

  def user_posts(user) do
    Club.ids_for_user(user)
    |> for_club_ids()
  end

  def for_clubs(clubs) do
    Enum.map(clubs, &(&1.id))
    |> for_club_ids()
  end

  def for_club(club) do
    [club.id]
    |> for_club_ids()
  end

  def for_club_ids(club_ids) do
    club_ids
    |> Channel.ids_for_club_ids()
    |> for_channel_ids()
  end

  def for_front_page(user) do
    Club.ids_for_user(user)
    |> Channel.ids_for_club_ids()
    |> for_channel_ids()
    |> by_activity()
  end

  def by_activity(query \\ Post) do
    query |> order_by(desc: :activity_at)
  end

  def most_recent(query \\ Post) do
    query |> by_activity() |> first()
  end

  def most_recent_for_channel(channel) do
    Ecto.assoc(channel, :posts) |> most_recent()
  end

  def most_recent_for_club(club) do
    Post.for_club(club) |> most_recent()
  end

  # does a full room load and does not need to
  def for_message(message) do
    message
    |> Ecto.assoc(:room)
    |> Repo.one()
    |> Ecto.assoc(:post)
  end

  def with_stream_preloads(list) do
    list
    |> Repo.preload(room: :messages)
    |> Repo.preload(:user)
    |> Repo.preload(:channel)
  end

  def with_messages(query \\ Post) do
    query
      |> join(:left, [p], _ in assoc(p, :room))
      |> join(:left, [_, room], _ in assoc(room, :messages))
      |> preload([_, r, m], [room: {r, messages: m}])
  end

  # ===========================
  # CREATE
  # ===========================

  def create_for_channel_and_user(chan, user, post_params, msg_params \\ false) do
    post_struct = %Post{
      title: post_params["title"],
      description: post_params["description"],
      type: post_params["type"],
      url: post_params["url"],
      user_id: user.id,
      activity_at: Ecto.DateTime.utc
    }
    post_cs = Ecto.build_assoc(chan, :posts, post_struct)

    multi = Multi.new
      |> Multi.insert(:post, post_cs)
      |> Multi.run(:room, fn %{post: post} ->
        room_cs = Ecto.build_assoc(post, :room, %{})
        Repo.insert(room_cs)
      end)
      |> Multi.run(:message, fn %{room: room} ->
        if (msg_params && msg_params.body) do
          msg_cs = Ecto.build_assoc(room, :messages, msg_params)
          Repo.insert(msg_cs)
        else
          {:ok, :no_message}
        end
      end)

    case Repo.transaction(multi) do
      {:ok, %{post: post, room: room} = res} ->
        Task.start(__MODULE__, :notify_new_post, [post, room, user])
        {:ok, res}
      other ->
        other
    end
  end

  def notify_new_post(post, room, user) do
    users_for_room = Room.user_ids_for_room(room)
    users_to_send_to = users_for_room -- [user.id]

    Danton.Notification.notify_users(
      users_to_send_to,
      :new_post,
      %{
        poster_name: user.name || user.email,
        post_title: post.title,
        post_path: "https://danton.herokuapp.com/posts/#{post.id}"
      }
    )
  end

  # ===========================
  # DESTROY
  # ===========================

	@doc """
  Removes a post and all associated content
  """
	def destroy(post_id) do
    # TODO: implement a soft-deletion system
    rooms = Repo.all(from(r in Room, where: r.post_id == ^post_id))
		Room.destroy_list(rooms)

		post = Repo.get(Post, post_id)
		Repo.delete!(post)
  end

  @doc """
  Removes a list of posts and all associated content
  """
	def destroy_list(post_list) do
    post_list
      |> Enum.map(&(&1.id))
      |> Enum.each(&Post.destroy/1)
  end

  def load_messages(post) do
    post |> Repo.preload([room: :messages])
  end

  # ===========================
  # OTHER
  # ===========================

  def update_activity_for_message!(message) do
    post = Post.for_message(message) |> Repo.one()
    Post.changeset(post, %{activity_at: message.inserted_at}) |> Repo.update
  end

  def latest_activity_time(post) do
    message = Message.latest_for_post(post)
    message && message.inserted_at || post.inserted_at
  end

  def latest_activity_type(post) do
    if (Message.latest_for_post(post)) do
      :messages
    else
      :post
    end
  end
end
