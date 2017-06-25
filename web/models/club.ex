defmodule Danton.Club do
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


  @doc """
  Builds a changeset for an associated channel
  """
  # def build_channel(club_id, channel_params) do
  #   club = Danton.Repo.get(Danton.Club, club_id)
  #   Ecto.build_assoc(club, :channels, channel_params)
  # end
end
