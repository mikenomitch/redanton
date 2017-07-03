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

  @doc """
  Makes and inserts a message for a room
  """
  def make_message(room, message_params) do
    cs = Ecto.build_assoc(room, :messages, message_params)
    Danton.Repo.insert!(cs)
  end
end
