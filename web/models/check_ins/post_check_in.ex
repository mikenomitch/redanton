defmodule Danton.PostCheckIn do
  use Danton.Web, :model

  alias Danton.Channel
  alias Danton.User

  # ===========================
  # ECTO CONFIG
  # ===========================

  schema "post_check_ins" do
    has_one :user, User
    has_one :post, Post

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
