defmodule Danton.PostsTags do
  use Danton.Web, :model

  # ===========================
  # ECTO CONFIG
  # ===========================

  schema "posts_tags" do
    belongs_to :post, Post
    belongs_to :tag, Tag

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct`
  """
  def changeset(struct) do
    struct
    |> assoc_constraint(:post)
    |> assoc_constraint(:tag)
  end
end