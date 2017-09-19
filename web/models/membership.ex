defmodule Danton.Membership do
  use Danton.Web, :model

  # ===========================
  # ECTO CONFIG
  # ===========================

  schema "memberships" do
    field :status, :string
    field :type, :string
    belongs_to :user, User
    belongs_to :club, Club

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:status, :type])
    |> validate_required([:status, :type])
  end

  # ===========================
  # QUERIES
  # ===========================

  # def for_users(query, users) do
  # end

  # def for_clubs(query, users) do
  # end

  # def of_type(query, type) do
  # end

  # def of_status(query, status) do
  # end

  # ===========================
  # GETTERS
  # ===========================

  # TODO: replace with query
  def for_clubs(club_ids) do
    # where(m in Membership, m.club_id in ^club_ids)
    from(c in Club, where: c.id in ^club_ids)
      |> Repo.all()
      |> Ecto.assoc(:memberships)
      |> Repo.all()
  end

  def for_user(user) do
    user
      |> Ecto.assoc(:memberships)
      |> Repo.all()
  end

  # ===========================
  # OTHER
  # ===========================
end
