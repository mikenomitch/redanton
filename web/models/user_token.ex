defmodule Danton.UserToken do
  use Danton.Web, :model

  # ===========================
  # ECTO CONFIG
  # ===========================

  schema "user_tokens" do
    field :status, :string
    field :value, :string
    field :type, :string
    belongs_to :user, User

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:type, :value, :status])
    |> validate_required([:value])
  end

  # ===========================
  # QUERIES
  # ===========================

  def for_user(query \\ UserToken, user_id) do
    from t in query, where: t.user_id == ^user_id
  end

  def of_value(query \\ UserToken, value) do
    from t in query, where: t.value == ^value
  end

  def first_for_user(query \\ UserToken, user_id) do
    for_user(user_id) |> first |> Repo.one
  end

  def find_or_create_for_user(token_value, user) do
    t = of_value(token_value) |> first_for_user(user.id)

    token = t || Repo.insert!(%UserToken{
      user_id: user.id,
      type: "push",
      value: token_value,
      status: "active"
    })

    {:ok, token}
  end
end
