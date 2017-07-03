defmodule Danton.Channel do
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
  Makes a channel associated to a given club
  """
  def make_post_for_user(chan, user, post_params) do
    cs = Ecto.build_assoc(chan, :posts, %{post_params | user_id: user.id})
    Danton.Repo.insert!(cs)
  end
end
