defmodule Danton.Channel do
  alias Danton.Repo
	use Danton.Web, :model

  schema "channels" do
    field :name, :string
    field :description, :string
    belongs_to :club, Danton.Club
    has_many :posts, Danton.Post

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

  @doc """
  Removes a channel and all associated content
  """
	def destroy(chan_id) do
    # TODO: implement a soft-deletion system
    posts = Danton.Repo.all(from(r in Danton.Post, where: r.channel_id == ^chan_id))
		Danton.Post.destroy_list(posts)

		channel = Danton.Repo.get(Danton.Channel, chan_id)
		Danton.Repo.delete!(channel)
  end

  @doc """
  Makes a channel associated to a given club
  """
  def make_post_for_user(chan, user, post_params) do
    cs = Ecto.build_assoc(chan, :posts, %{post_params | user_id: user.id})
    Danton.Repo.insert(cs)
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
  Gets the users associated with its club
  """
  def users_for_channel(chan_id) do
    channel = Danton.Repo.get(Danton.Channel, chan_id)
    Danton.Club.users_for_club(channel.club_id)
  end
end
