defmodule Danton.GeneralCheckIn do
  use Danton.Web, :model

  alias Danton.User

  # ===========================
  # ECTO CONFIG
  # ===========================

  schema "general_check_ins" do
    field :type, :string
    has_one :user, User

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:type])
    |> validate_required([:type])
  end
end
