defmodule Danton.Comment do
  use Danton.Web, :model

  schema "comments" do
    field :body, :string
    field :parent_type, :string
    belongs_to :comment, Danton.Comment
    belongs_to :post, Danton.Post
    belongs_to :user, Danton.User
    has_many :comments, Danton.Comment

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:body, :parent_type])
    |> validate_required([:body, :parent_type])
  end
end
