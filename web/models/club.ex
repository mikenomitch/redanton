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

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:name, :description])
    |> validate_required([:name, :description])
  end

  # ===========================
  # QUERIES
  # ===========================

  # def for_members(query, users) do
  # end

  # def for_memberships(query, users) do
  # end

  # def for_channels(query, users) do
  # end

  def for_user(user) do
    user |> Ecto.assoc(:clubs)
  end

  def select_id(query) do
    from c in query, select: c.id
  end

  # ===========================
  # GETTERS
  # ===========================

  def ids_for_user(user) do
    Club.for_user(user)
      |> select_id()
      |> Repo.all()
  end

  @doc """
  gets all the channel_ids for a list of club_ids
  """
  def channel_ids_for_club_ids(club_ids) do
    # TODO: call query defined in Channel
    from(c in Channel, where: c.club_id in ^club_ids, select: c.id) |> Repo.all
  end

  @doc """
  gets all the channels for a list of clubs
  """
  def memberships_for_club(club_id) do
    # TODO: call query defined in Membership
    Repo.get(Club, club_id)
    |> Ecto.assoc(:memberships)
    |> Repo.all
	end

  @doc """
  gets all the channels for a list of clubs
  """
  def channels_for_clubs(clubs) do
    # TODO: call query defined in Channel
		case clubs do
			[] -> []
			_ -> Ecto.assoc(clubs, :channels) |> Repo.all
		end
  end

  # ===========================
  # CREATE
  # ===========================

  @doc """
  Makes an admin level membership in a club for a user
  """
  def make_admin(club, user) do
    make_member(club, user, "admin")
  end

  @doc """
  Makes an standard level membership in a club for a user
  """
  def make_standard_member(club, user) do
    make_member(club, user, "standard")
  end

  @doc """
  Makes an admin level membership in a club for a user
  """
  def make_member(club, user, type) do
    club
    |> Ecto.build_assoc(:memberships, %{user_id: user.id, type: type})
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
end
