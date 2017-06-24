defmodule Danton.Membership do
  use Danton.Web, :model

  schema "memberships" do
    field :status, :string
    field :type, :string
    belongs_to :user, Danton.User
    belongs_to :club, Danton.Club

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
end
