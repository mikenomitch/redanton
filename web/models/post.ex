defmodule Danton.Post do
  use Danton.Web, :model

  schema "posts" do
    field :title, :string
    field :description, :string
    field :type, :string
    field :url, :string
    belongs_to :channel, Danton.Channel
    belongs_to :user, Danton.User
    has_one :room, Danton.Room
    many_to_many :messages, Danton.Message, join_through: "room"

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

  @doc """
  Makes an associated room for a post
  """
  def make_room(post) do
    cs = Ecto.build_assoc(post, :room, %{})
    Danton.Repo.insert!(cs)
  end

  @doc """
  Gets the room associated with a post if it exists
  """
  def get_room(post_id) do
     [room] = Danton.Repo.all(from(r in Danton.Room, where: r.post_id == ^post_id, preload: :post))
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
    rooms = Danton.Repo.all(from(r in Danton.Room, where: r.post_id == ^post_id))
		Danton.Room.destroy_list(rooms)

		post = Danton.Repo.get(Danton.Post, post_id)
		Danton.Repo.delete!(post)
  end

  @doc """
  Gets the users associated with its channel
  """
  def users_for_post(post_id) do
    # as it stands, this takes an inefficient route to get
    # its users - do not aggregate these calls
    post = Danton.Repo.get(Danton.Post, post_id)
    Danton.Channel.users_for_channel(post.channel_id)
  end
end
