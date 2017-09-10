defmodule Danton.PostCheckIn do
  use Danton.Web, :model

  schema "post_check_ins" do
    has_one :user, Danton.User
    has_one :post, Danton.Post

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [])
  end
end
