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

  def for_post(query \\ Room, post_id) do
    from r in query, where: r.post_id == ^post_id
  end

  def with_post(query \\ Room) do
    from r in query, preload: :post
  end

  def select_id(query \\ Room) do
    from r in query, select: r.id
  end

  def select_post_id(query \\ Room) do
    from r in query, select: r.post_id
  end

  # ===========================
  # GETTERS
  # ===========================

  def for_and_with_post(post_id) do
    Room
      |> for_post(post_id)
      |> with_post()
      |> Repo.one()
  end

  def id_for_post(post_id) do
    Room
      |> for_post(post_id)
      |> select_id()
      |> Repo.one()
  end

  def pluck_post_id(room_id) do
    Repo.get(Room, room_id).post_id
  end

  # ids for room

  def user_ids_for_room(room = %Danton.Room{}) do
    user_ids_for_room(room.id)
  end

  def user_ids_for_room(room_id) do
    User.for_room(room_id)
    |> Repo.all()
    |> Enum.map(& &1.id)
  end

  # ===========================
  # DESTROY
  # ===========================

  @doc """
  Removes all messages associated to a room
  """
	def destroy_messages(room) do
    Message.for_room(Message, room.id) |> Repo.delete_all
	end

	@doc """
  Removes room records and assocd message
  """
	def destroy_list(rooms) do
		Enum.each(rooms, &Room.destroy_messages/1)
		Enum.each(rooms, &Repo.delete!/1)
  end
end
