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
    |> validate_required([:title, :description, :type, :url])
  end

  @doc """
  Makes an associated room for a post
  """
  def make_room(post) do
    cs = Ecto.build_assoc(post, :room, %{})
    Danton.Repo.insert!(cs)
  end
end
