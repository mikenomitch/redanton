defmodule Danton.Post do
  use Danton.Web, :model

  schema "posts" do
    field :title, :string
    field :description, :text
    field :type, :string
    field :url, :string
    belongs_to :channel, Danton.Channel
    belongs_to :user, Danton.User
    has_many :comments, Danton.Comment  

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
end
