defmodule Danton.Club do
	alias Danton.Repo
  use Danton.Web, :model

  schema "clubs" do
    field :name, :string
    field :description, :string
    has_many :channels, Danton.Channel
    has_many :memberships, Danton.Membership
    many_to_many :members, Danton.User, join_through: "memberships"

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
    Danton.Repo.insert!(cs)
  end

  @doc """
  Makes a channel associated to a given club
  """
  def make_channel(club, channel_params) do
    cs = Ecto.build_assoc(club, :channels, channel_params)
    Danton.Repo.insert!(cs)
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
  gets all the channels for a list of clubs
  """
	def memberships_for_club(club_id) do
		club = Danton.Repo.get(Danton.Club, club_id)
		Ecto.assoc(club, :memberships) |> Danton.Repo.all
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
