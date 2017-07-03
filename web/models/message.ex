defmodule Danton.Message do
  use Danton.Web, :model

  schema "messages" do
    field :body, :string
    belongs_to :room, Danton.Room
    belongs_to :user, Danton.User

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:body])
    |> validate_required([:body])
  end
end
