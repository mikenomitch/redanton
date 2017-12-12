defmodule Danton.Notification do
  use Danton.Web, :model

  # ===========================
  # ECTO CONFIG
  # ===========================

  schema "notifications" do
    field :type, :string
    field :status, :string
    field :data, :map, default: %{}
    belongs_to :user, User

    timestamps()
  end

  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:type, :status, :data])
    |> validate_required([:type, :status])
  end

  def for_user(query \\ Notification, user_id) do
    from n in query, where: n.user_id == ^user_id
  end

  def not_for_user(query \\ Notification, user_id) do
    from n in query, where: n.user_id != ^user_id
  end

  def by_user_id(query \\ Notification) do
    query |> group_by([n], [n.user_id, n.id])
  end

  def of_type(query \\ Notification, type) do
    from n in query, where: n.type == ^type
  end

  def of_status(query \\ Notification, status) do
    from n in query, where: n.status == ^status
  end

  # ===========================
  # OTHER
  # ===========================

  def for_batch_notification(query \\ Notification) do
    # add grouping by in here
    query
    |> of_status("pending")
    |> Repo.all()
    |> by_user()
  end

  defp by_user(notifications_list) do
    Enum.group_by(
      notifications_list,
      &(&1.user_id)
    )
  end
end
