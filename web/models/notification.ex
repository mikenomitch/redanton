defmodule Danton.Notification do
  use Danton.Web, :model

  # ===========================
  # ECTO CONFIG
  # ===========================

  schema "notifications" do
    field :type, :string
    field :status, :string
    field :data, :map
    belongs_to :user, User

    timestamps()
  end

  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:type, :status, :data])
    |> validate_required([:type, :status])
  end

  # ===========================
  # QUERIES
  # ===========================

  def for_user(query \\ Notification, user_id) do
    from t in query, where: t.user_id == ^user_id
  end

  def not_for_user(query \\ Notification, user_id) do
    from t in query, where: t.user_id != ^user_id
  end

  def by_user(query \\ Notification) do
    query |> group_by([n], [n.user_id])
  end

  def of_type(query \\ Notification, type) do
    from t in query, where: t.type == ^type
  end

  def of_status(query \\ Notification, of_status) do
    from t in query, where: t.of_status == ^of_status
  end

  def for_batch_notification(query \\ Notification) do
    query
    |> of_status("pending")
    |> by_user()
  end
end
