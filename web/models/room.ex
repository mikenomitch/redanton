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
    from r in query, where: r.post_id == ^post_id
  end

  def with_post(query) do
    from r in query, preload: :post
  end

  def select_id(query) do
    from r in query, select: r.id
  end

  def select_post_id(query) do
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
      |> Repo.one
  end

  def pluck_post_id(room_id) do
    Room
      |> Repo.get(room_id)
      |> select_post_id()
      |> Repo.one
  end

  # ===========================
  # CREATE
  # ===========================

  @doc """
  Makes and inserts a message for a room
  """
  def make_message(room, message_params) do
    Message.create_message_for_room(room, message_params)
  end

  # ===========================
  # DESTROY
  # ===========================

  @doc """
  Removes all messages associated to a room
  """
	def destroy_messages(room) do
    # TODO: implement a soft-deletion system
    Message.for_room(room.id) |> Repo.delete_all
	end

	@doc """
  Removes room records and assocd message
  """
	def destroy_list(rooms) do
    # TODO: implement a soft-deletion system
		Enum.each(rooms, &Room.destroy_messages/1)
		Enum.each(rooms, &Repo.delete!/1)
  end
end
