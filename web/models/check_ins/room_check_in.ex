defmodule Danton.RoomCheckIn do
  use Danton.Web, :model

  # ===========================
  # ECTO CONFIG
  # ===========================

  schema "room_check_ins" do
    field :user_id, :integer
    field :room_id, :integer
    has_one :user, User
    has_one :room, Room

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [])
  end
end
