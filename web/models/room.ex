defmodule Danton.Room do
  use Danton.Web, :model

  # ===========================
  # ECTO CONFIG
  # ===========================

  schema "rooms" do
    belongs_to :post, Post
    has_many :messages, Message, on_delete: :delete_all

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

  def for_post(query, post_id) do
    # TODO: move the preload out
    from(r in query, where: r.post_id == ^post_id, preload: :post)
  end

  def with_post(query) do
    # TODO: move the preload down here
    query
  end

  # ===========================
  # GETTERS
  # ===========================

  def for_and_with_post(post_id) do
    [room] = Room
      |> for_post(post_id)
      |> with_post()
      |> Repo.all()

    room
  end

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
