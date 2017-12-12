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

  def of_id(query \\ Notification, ids) do
    from n in query, where: n.id in ^ids
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

  def mark_pending(notifications_list) do
    notifications_list
    |> Enum.map(&(&1.id))
    |> of_id()
    |> Repo.update_all(set: [status: "sent"])
  end

  # =============
  # CLEARING
  # =============

  def clear_chat_notifications(user_id, :room, id) do
    post_id = Danton.Repo.get(Room, id).post_id
    clear_chat_notifications(user_id, :post, post_id)
  end

  def clear_chat_notifications(user_id, :post, _id) do
    # THIS IS CLEARING ALL CHAT NOTIFICATIONS IF THEY
    # CHECK INTO ANY CHAT (THIS IS OKAY FOR NOW BUT
    # NOT THE RIGHT THING LONG TERM)
    moot_for_user_and_type(user_id, "new_chat_message")
  end

  def clear_post_notifications(user_id) do
    moot_for_user_and_type(user_id, "new_post")
  end

  def moot_for_user_and_type(user_id, type) do
    Notification
    |> for_user(user_id)
    |> of_type(type)
    |> of_status("pending")
    |> Repo.update_all(set: [status: "moot"])
  end
end
