defmodule Danton.Tag do
  use Danton.Web, :model

  # ===========================
  # ECTO CONFIG
  # ===========================

  schema "tags" do
    field :name, :string
    many_to_many :posts, Tag, join_through: "posts_tags"

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
end