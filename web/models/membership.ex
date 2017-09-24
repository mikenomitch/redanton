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

  def for_user(user) do
    user |> Ecto.assoc(:memberships)
  end
end
