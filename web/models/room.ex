defmodule Danton.Room do
  use Danton.Web, :model

  alias Danton.Repo
  alias Danton.Message
  alias Danton.Post
  alias Danton.User

  # ===========================
  # ECTO CONFIG
  # ===========================

  schema "rooms" do
    belongs_to :post, Post
    has_many :messages, Message

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [])
    |> validate_required([])
  end

  # ===========================
  # QUERIES
  # ===========================

  # TODO: SPLIT OUT ECTO QUERIES

  # ===========================
  # OTHER
  # ===========================

  @doc """
  Makes and inserts a message for a room
  """
  def make_message(room, message_params) do
    Message.create_message_for_room(room, message_params)
	end

  @doc """
  Removes all messages associated to a room
  """
	def destroy_messages(room) do
    # TODO: implement a soft-deletion system
    messages = Repo.all(from(r in Message, where: r.room_id == ^room.id))
		Enum.each(messages, &Repo.delete!/1)
	end

	@doc """
  Removes room records and assocd message
  """
	def destroy_list(rooms) do
    # TODO: implement a soft-deletion system
		Enum.each(rooms, &Room.destroy_messages/1)
		Enum.each(rooms, &Repo.delete!/1)
  end

  @doc """
  Gets the users associated with its room
  """
  def users_for_room(room_id) do
    # as it stands, this takes an inefficient route to get
    # its users - do not aggregate these calls
    room = Repo.get(Room, room_id)
    Post.users_for_post(room.post_id)
  end
end
