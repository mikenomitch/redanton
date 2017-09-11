defmodule Danton.Room do
  use Danton.Web, :model

  schema "rooms" do
    belongs_to :post, Danton.Post
    has_many :messages, Danton.Message

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

  @doc """
  Makes and inserts a message for a room
  """
  def make_message(room, message_params) do
    Danton.Message.create_message_for_room(room, message_params)
	end

  @doc """
  Removes all messages associated to a room
  """
	def destroy_messages(room) do
    # TODO: implement a soft-deletion system
    messages = Danton.Repo.all(from(r in Danton.Message, where: r.room_id == ^room.id))
		Enum.each(messages, &Danton.Repo.delete!/1)
	end

	@doc """
  Removes room records and assocd message
  """
	def destroy_list(rooms) do
    # TODO: implement a soft-deletion system
		Enum.each(rooms, &Danton.Room.destroy_messages/1)
		Enum.each(rooms, &Danton.Repo.delete!/1)
  end

  @doc """
  Gets the users associated with its room
  """
  def users_for_room(room_id) do
    # as it stands, this takes an inefficient route to get
    # its users - do not aggregate these calls
    room = Danton.Repo.get(Danton.Room, room_id)
    Danton.Post.users_for_post(room.post_id)
  end
end
