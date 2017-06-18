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
end
