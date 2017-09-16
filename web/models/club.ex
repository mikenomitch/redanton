defmodule Danton.Club do
  use Danton.Web, :model
  
  alias Danton.Repo
  alias Danton.Channel
  alias Danton.Club
  alias Danton.Membership
  alias Danton.User

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

  # TODO: SPLIT OUT ECTO QUERIES

  # ==================
  # MEMBERSHIP HELPERS
  # ==================

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
    cs = Ecto.build_assoc(club, :memberships, %{user_id: user.id, type: type})
    Repo.insert!(cs)
  end

  @doc """
  Makes a channel associated to a given club
  """
  def make_channel(club, channel_params) do
    cs = Ecto.build_assoc(club, :channels, channel_params)
    Repo.insert!(cs)
  end

	@doc """
  gets all the channels for a list of clubs
  """
	def channels_for_clubs(clubs) do
		case clubs do
			[] -> []
			_ -> Ecto.assoc(clubs, :channels) |> Repo.all
		end
  end

  @doc """
  gets all the channel_ids for a list of club_ids
  """
	def channel_ids_for_club_ids(club_ids) do
    from(c in Channel, where: c.club_id in ^club_ids, select: c.id) |> Repo.all
	end

	@doc """
  gets all the channels for a list of clubs
  """
	def memberships_for_club(club_id) do
		club = Repo.get(Club, club_id)
		Ecto.assoc(club, :memberships) |> Repo.all
	end

	@doc """
	gets all the users in a club
	"""
	def users_for_club(club_id) do
		memberships_for_club(club_id)
			|> Ecto.assoc(:user)
		  |> Repo.all
  end
end
