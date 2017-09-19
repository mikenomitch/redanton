defmodule Danton.Post do
  use Danton.Web, :model

  # ===========================
  # ECTO CONFIG
  # ===========================

  schema "posts" do
    field :title, :string
    field :description, :string
    field :type, :string
    field :url, :string
    belongs_to :channel, Channel
    belongs_to :user, User
    has_one :room, Room
    many_to_many :messages, Message, join_through: "room"

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:title, :description, :type, :url])
    |> validate_required([:title, :url])
  end

  # ===========================
  # QUERIES
  # ===========================

  # TODO: SPLIT OUT ECTO QUERIES

  @doc """
  gets all the channels for a list of clubs
  """
  def for_channel_ids(channel_ids) do
    from(p in Post, where: p.channel_id in ^channel_ids)
  end

  # ===========================
  # CREATE
  # ===========================

  @doc """
  Makes an associated room for a post
  """
  def make_room(post) do
    cs = Ecto.build_assoc(post, :room, %{})
    Repo.insert!(cs)
  end

  @doc """
  Makes an associated room for a post, and adds a message
  """
  def make_room(post, message_params) do
    room = Danton.Post.make_room(post)
    Room.make_message(room, message_params)
  end

  # ===========================
  # DESTROY
  # ===========================

	@doc """
  Removes a post and all associated content
  """
	def destroy(post_id) do
    # TODO: implement a soft-deletion system
    rooms = Repo.all(from(r in Room, where: r.post_id == ^post_id))
		Room.destroy_list(rooms)

		post = Repo.get(Post, post_id)
		Repo.delete!(post)
  end

  @doc """
  Removes a list of posts and all associated content
  """
	def destroy_list(post_list) do
    # TODO: implement
    post_list
      |> Enum.map(&(&1.id))
      |> Enum.each(&Post.destroy/1)
  end
end
