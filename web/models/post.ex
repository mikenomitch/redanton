defmodule Danton.Post do
  use Danton.Web, :model

  alias Danton.Repo
  alias Danton.Channel
  alias Danton.Message
  alias Danton.Room
  alias Danton.User

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

  # ===========================
  # OTHER
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

  @doc """
  Gets the room associated with a post if it exists
  """
  def get_room(post_id) do
     [room] = Repo.all(from(r in Room, where: r.post_id == ^post_id, preload: :post))
     room
  end

  @doc """
  Gets the room associated with a post if it exists
  """
  def get_room_id(post_id) do
    # this can be done with a select in the future
    get_room(post_id).id
	end

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

  @doc """
  Gets the users associated with its channel
  """
  def users_for_post(post_id) do
    # as it stands, this takes an inefficient route to get
    # its users - do not aggregate these calls
    post = Repo.get(Post, post_id)
    Channel.users_for_channel(post.channel_id)
  end
end
