defmodule Danton.UserToken do
  use Danton.Web, :model

  # ===========================
  # ECTO CONFIG
  # ===========================

  schema "user_tokens" do
    field :status, :string
    field :value, :string
    field :type, :string
    belongs_to :user, User

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:type, :value, :status])
    |> validate_required([:value])
  end
end
