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
    |> update_change(:name, &String.downcase/1)
    |> validate_required([:name])
    |> validate_length(:name, min: 1, max: 150)
    |> unique_constraint(:name)
  end

  # =========
  #  HELPERS
  # =========

  def builg_tags_from_params(_post, nil), do: {:ok, :no_tags}
  def builg_tags_from_params(_post, ""), do: {:ok, :no_tags}

  def build_tags_from_params(post, params) do
    tag_names = params
      |> String.split(",")
      |> Enum.map(&String.trim/1)
      |> Enum.map(&String.downcase/1)
      |> Enum.filter(&(String.length(&1) > 0))

    tags = Enum.map(tag_names, &(build_tag_from_name(post, &1)))

    {:ok, tags}
  end

  def build_tag_from_name(post, tag_name) do
    {:ok, tag} = Repo.insert(
      %Danton.Tag{name: tag_name},
      on_conflict: [set: [name: tag_name]],
      conflict_target: :name
    )

    Repo.insert(
      %Danton.PostsTags{post_id: post.id, tag_id: tag.id}
    )

    tag
  end

  # =========
  #  QUERIES
  # =========

  def for_user(u = %User{}) do
    Post.user_posts(u) |> Tag.for_posts()
  end

  def for_club(club_id) when is_integer(club_id) do
    Post.for_club_ids([club_id]) |> Tag.for_posts()
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

  def include_posts_tags(tags) when is_list(tags) do
    Enum.map(tags, &include_posts_tags/1)
  end

  def include_posts_tags(tag = %Tag{}) do
    Repo.preload(tag, :posts_tags)
  end
end