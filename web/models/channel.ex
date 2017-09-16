defmodule Danton.Channel do
  use Danton.Web, :model

  alias Danton.Repo
  alias Danton.Club
  alias Danton.Post

  # ===========================
  # ECTO CONFIG
  # ===========================

  schema "channels" do
    field :name, :string
    field :description, :string
    belongs_to :club, Club
    has_many :posts, Post

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:name, :description])
    |> validate_required([:name, :description])
  end

  # ===========================
  # QUERIES
  # ===========================

  # TODO: SPLIT OUT ECTO QUERIES

  # ===========================
  # OTHER
  # ===========================

  @doc """
  Removes a channel and all associated content
  """
	def destroy(chan_id) do
    # TODO: implement a soft-deletion system
    posts = Repo.all(from(r in Post, where: r.channel_id == ^chan_id))
		Post.destroy_list(posts)

		channel = Repo.get(Channel, chan_id)
		Repo.delete!(channel)
  end

  @doc """
  Makes a channel associated to a given club
  """
  def make_post_for_user(chan, user, post_params) do
    cs = Ecto.build_assoc(chan, :posts, %{post_params | user_id: user.id})
    Repo.insert(cs)
	end

	@doc """
  gets all the channels for a list of clubs
  """
	def posts_for_channels(channels) do
		case channels do
			[] -> []
			_ -> Ecto.assoc(channels, :posts) |> Repo.all
		end
  end

  @doc """
  gets all the channels for a list of clubs
  """
	def posts_for_channel_ids(channel_ids) do
		from(p in Post, where: p.channel_id in ^channel_ids) |> Repo.all
  end

  @doc """
  gets list of post_ids from list of channel_ids
  """
	def post_ids_for_channel_ids(channel_ids) do
    from(p in Post, where: p.channel_id in ^channel_ids, select: p.id) |> Repo.all
	end

  @doc """
  Gets the users associated with its club
  """
  def users_for_channel(chan_id) do
    channel = Repo.get(Channel, chan_id)
    Danton.Club.users_for_club(channel.club_id)
  end
end
