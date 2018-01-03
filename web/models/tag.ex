defmodule Danton.Tag do
  use Danton.Web, :model

  # ===========================
  # ECTO CONFIG
  # ===========================

  schema "tags" do
    field :name, :string
    has_many :posts_tags, PostsTags
    many_to_many :posts, Post, join_through: "posts_tags"

    # field :activity_at, Ecto.DateTime, virtual: true
    field :post_count, :integer, virtual: true

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:name])
    |> validate_required([:name])
    |> validate_length(:name, min: 1, max: 150)
    |> unique_constraint(:name)
  end

  # =========
  #  QUERIES
  # =========

  def for_user(u = %User{}) do
    Post.user_posts(u) |> Tag.for_posts()
  end

  # THE WORST N+1 Ever
  def for_posts(query \\ Post) do
    all_posts = Repo.all(query)
    list_of_all_tags = Enum.map(
      all_posts,
      &(Repo.all(Ecto.assoc(&1, :tags)))
    ) |> List.flatten()

    uniq_ids = list_of_all_tags
      |> Enum.map(&(&1.id))
      |> Enum.uniq

    Tag.by_id(uniq_ids)
  end

  def by_id(id_list) do
    from(t in Tag, where: t.id in ^id_list)
  end

  def with_post_counts_for_club_ids(tags, club_ids) do
    Enum.map(tags, &(with_post_count_for_club_ids(&1, club_ids) ))
  end

  def with_post_count_for_club_ids(tag, club_ids) do
    count = Ecto.assoc(tag, :posts)
      |> Post.for_club_ids(club_ids)
      |> Repo.aggregate(:count, :id)

    %{tag | post_count: count}
  end
end