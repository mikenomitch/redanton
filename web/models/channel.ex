defmodule Danton.Channel do
  use Danton.Web, :model

  # ===========================
  # ECTO CONFIG
  # ===========================

  schema "channels" do
    field :name, :string
    field :description, :string
    belongs_to :club, Club
    has_many :posts, Post

    field :activity_at, Ecto.DateTime, virtual: true
    field :post_count, :integer, virtual: true

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:name, :description])
    |> validate_required([:name])
    |> validate_length(:name, min: 1, max: 60)
    |> validate_length(:description, max: 250)
  end

  # ===========================
  # QUERIES
  # ===========================

  def for_club(query \\ Channel, club_id) do
    from(ch in query, where: ch.club_id == ^club_id)
  end

  def for_clubs(query \\ Channel, club_ids) do
    from(ch in query, where: ch.club_id in ^club_ids)
  end

  def select_id(query \\ Channel) do
    from ch in query, select: ch.id
  end

  def for_user(query \\ Channel, user) do
    ids = Club.for_user(user) |> Repo.all() |> Enum.map(&(&1.id))
    for_clubs(query, ids)
  end

  # ===========================
  # GETTERS
  # ===========================

  def ids_for_club_ids(club_ids) do
    for_clubs(club_ids)
      |> select_id()
      |> Repo.all()
  end

  def user_has_none(user) do
    count = Channel.for_user(user) |> Repo.aggregate(:count, :id)
    count == 0
  end

  # ===========================
  # OTHER
  # ===========================

  @doc """
  Removes a channel and all associated content
  """
	def destroy(chan_id) do
    # TODO: implement a soft-deletion system
    # posts = Repo.all(from(p in Post, where: p.channel_id == ^chan_id))
		# Post.destroy_list(posts)

		channel = Repo.get(Channel, chan_id)
		Repo.delete!(channel)
  end

  # N + 1 ! (fix later)
  def with_activity_at(channel) do
    most_recent_post = Post.most_recent_for_channel(channel) |> Repo.one
    activity_at_time = most_recent_post && most_recent_post.activity_at || channel.inserted_at
    %{channel | activity_at: activity_at_time}
  end

  def preload_most_recent_activity(channels) do
    Enum.map(channels, &Channel.with_activity_at/1)
  end

  # N + 1 ! (fix later)
  def with_post_count(channel) do
    post_count = Ecto.assoc(channel, :posts)
      |> Repo.aggregate(:count, :id)

    %{channel | post_count: post_count}
  end

  def preload_post_counts(channels) do
    Enum.map(channels, &Channel.with_post_count/1)
  end
end
