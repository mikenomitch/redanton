defmodule Danton.Room do
  use Danton.Web, :model

  schema "rooms" do
    belongs_to :post, Danton.Post
    has_many :messages, Danton.Message

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [])
    |> validate_required([])
  end
end
