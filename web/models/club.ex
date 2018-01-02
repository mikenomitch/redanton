defmodule Danton.Club do
  use Danton.Web, :model

  # ===========================
  # ECTO CONFIG
  # ===========================

  schema "clubs" do
    field :name, :string
    field :description, :string
    has_many :channels, Channel
    has_many :memberships, Membership
    many_to_many :members, User, join_through: "memberships"

    field :channel_count, :integer, virtual: true
    field :post_count, :integer, virtual: true
    field :member_count, :integer, virtual: true
    field :activity_at, Ecto.DateTime, virtual: true

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

  def for_user(user) do
    user |> Ecto.assoc(:clubs)
  end

  def select_id(query \\ Club) do
    from c in query, select: c.id
  end

  def user_club_ids(user) do
    for_user(user) |> select_id
  end

  # ===========================
  # GETTERS
  # ===========================

  def user_club_by_id(user, club_id) do
    user
    |> for_user()
    |> Repo.get(club_id)
  end

  def ids_for_user(user) do
    user_club_ids(user)
    |> Repo.all()
  end

  def get_user_club(user, club_id) do
    for_user(user) |> Repo.get(club_id)
  end

  def user_has_none(user) do
    club_count = Club.for_user(user) |> Repo.aggregate(:count, :id)
    club_count == 0
  end

  # ===========================
  # CREATE
  # ===========================

  @doc """
  Makes an admin level membership in a club for a user
  """
  def make_admin(club, user) do
    make_member(club, user, "admin", "accepted")
  end

  @doc """
  Makes an standard level membership in a club for a user
  """
  def make_standard_member(club, user) do
    make_member(club, user, "standard", "accepted")
  end

  @doc """
  Makes an admin level membership in a club for a user
  """
  defp make_member(club, user, type, status) do
    club
    |> Ecto.build_assoc(:memberships, %{user_id: user.id, type: type, status: status})
    |> Repo.insert()
  end

  @doc """
  Makes a channel associated to a given club
  """
  def make_channel(club, name) when is_binary(name) do
    club
    |> Ecto.build_assoc(:channels, %Danton.Channel{name: name})
    |> Repo.insert!()
  end

  @doc """
  Makes a channel associated to a given club
  """
  def make_channel(club, channel_params) do
    club
    |> Ecto.build_assoc(:channels, channel_params)
    |> Repo.insert!()
  end

  def create(club_params, user = %Danton.User{}) do
    with cs <- Club.changeset(%Club{}, club_params),
         { :ok, club } <- Repo.insert(cs),
         { :ok, user } <- Club.make_admin(club, user),
         _channels <-Club.channels_from_list(club, club_params["channel_list"])
    do
      { :ok, club }
    else
      e -> e
    end
  end

  def channels_from_list(club, chan_list = nil), do: []
  def channels_from_list(club, chan_list = ""), do: []
  def channels_from_list(club, chan_list) when is_binary(chan_list) do
    chan_list
    |> String.split(",")
    |> Enum.map(&String.trim/1)
    |> Enum.filter(&(String.length(&1) > 0))
    |> Enum.map(&(Club.make_channel(club, &1)))
  end

  # ===========================
  # OTHER
  # ===========================

  # N + 1 ! (fix later)
  def with_member_count(club) do
    member_count = Ecto.assoc(club, :memberships)
      |> Repo.aggregate(:count, :id)

    %{club | member_count: member_count}
  end

  # N + 1 ! (fix later)
  def with_channel_count(club) do
    channel_count = Ecto.assoc(club, :channels)
      |> Repo.aggregate(:count, :id)

    %{club | channel_count: channel_count}
  end

  def preload_channel_counts(clubs) do
    Enum.map(clubs, &Club.with_channel_count/1)
  end

  # N + 1 ! (fix later)
  def with_post_count(club) do
    post_count = Post.for_club(club) |> Repo.aggregate(:count, :id)
    %{club | post_count: post_count}
  end

  def preload_post_counts(clubs) do
    Enum.map(clubs, &Club.with_post_count/1)
  end

  # N + 1 ! (fix later)
  def with_activity_at(club) do
    most_recent_post = Post.most_recent_for_club(club) |> Repo.one
    activity_at_time = most_recent_post && most_recent_post.activity_at || club.inserted_at
    %{club | activity_at: activity_at_time}
  end

  def preload_most_recent_activity(clubs) do
    Enum.map(clubs, &Club.with_activity_at/1)
  end
end
