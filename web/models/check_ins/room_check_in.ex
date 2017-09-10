defmodule Danton.RoomCheckIn do
  use Danton.Web, :model

  schema "room_check_ins" do
    has_one :user, Danton.User
    has_one :room, Danton.Room

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
