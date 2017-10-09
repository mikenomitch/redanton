defmodule Danton.Channel do
  use Danton.Web, :model

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
    |> validate_required([:name])
  end

  # ===========================
  # QUERIES
  # ===========================

  def for_club(query \\ Channel, club_id) do
    from(ch in query, where: ch.club_id == ^club_id)
  end

  def for_clubs(query \\ Channel, club_ids) do
    from(ch in query, where: ch.club_id in ^club_ids)
  end

  def select_id(query \\ Channel) do
    from ch in query, select: ch.id
  end

  def for_user(query \\ Channel, user) do
    ids = Club.for_user(user) |> Repo.all() |> Enum.map(&(&1.id))
    for_clubs(query, ids)
  end

  # ===========================
  # GETTERS
  # ===========================

  def ids_for_club_ids(club_ids) do
    for_clubs(club_ids)
      |> select_id()
      |> Repo.all()
  end

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
  # def make_post_for_user(chan, user, post_params) do
  #   cs = Ecto.build_assoc(chan, :posts, %{post_params | user_id: user.id})
  #   Repo.insert(cs)
	# end
end
