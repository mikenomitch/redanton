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

  # ===========================
  # QUERIES
  # ===========================

  def since_time(query \\ RoomCheckIn, time) do
    from c in query, where: c.inserted_at > ^time
  end

  def for_room(query \\ RoomCheckIn, room_id) do
    from c in query, where: c.room_id == ^room_id
  end

  def select_user_id(query \\ RoomCheckIn) do
    from c in query, select: map(c, [:user_id])
  end
end
