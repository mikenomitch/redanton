# TODO: make all of these async
defmodule Danton.CheckIn do
  use Danton.Web, :model

  # ===========================
  # QUERIES
  # ===========================

  # TODO: write after_date query

  # ===========================
  # OTHER
  # ===========================

  def check_in_room(room, user) do
    RoomCheckIn.changeset(
      %Danton.RoomCheckIn{},
      %{user_id: user.id, room_id: room.id}
    ) |> Repo.insert()

    queue_notifications_clear(user.id, :room, room.id)
  end

  def users_checked_in_since(time, %{id: id, type: :room}) do
    RoomCheckIn.since_time(time)
      |> RoomCheckIn.for_room(id)
      |> RoomCheckIn.select_user_id()
      |> Repo.all()
  end

  # ===========================
  # NOTIFICAITON CLEARING
  # ===========================

  def queue_notifications_clear(user_id, :room, id) do
    Task.start(Danton.Notification, :clear_chat_notifications, [user_id, :room, id])
  end

  def queue_notifications_clear(user_id, :post, id) do
    Task.start(Danton.Notification, :clear_chat_notifications, [user_id, :post, id])
  end

  def queue_notifications_clear(user_id, :front) do
    Task.start(Danton.Notification, :clear_post_notifications, [user_id])
  end

  # =============================
  # USING MACRO
  # =============================

  defmacro __using__(:controller) do
    quote do
      def check_in(conn, :front_page) do
        user_id = get_user_id(conn)

        if (user_id) do
          GeneralCheckIn.changeset(
            %Danton.GeneralCheckIn{},
            %{user_id: user_id, type: "front"}
          ) |> Repo.insert

          Danton.CheckIn.queue_notifications_clear(user_id, :front)
        end

        conn
      end

      def check_in(conn, :post) do
        user_id = get_user_id(conn)
        post_id = conn.params["id"]

        if (user_id) do
          PostCheckIn.changeset(
            %Danton.PostCheckIn{},
            %{user_id: user_id, post_id: post_id}
          ) |> Repo.insert

          Danton.CheckIn.queue_notifications_clear(user_id, :post, post_id)
        end

        conn
      end

      def check_in(conn, :channel) do
        user_id = get_user_id(conn)
        channel_id = conn.params["channel_id"] ||conn.params["id"]

        if (user_id && channel_id) do
          ChannelCheckIn.changeset(
            %Danton.ChannelCheckIn{},
            %{user_id: user_id, channel_id: channel_id}
          ) |> Repo.insert
        end

        conn
      end

      defp get_user_id(%{private: private_params}) do
        with %{guardian_default_claims: claims} <- private_params,
             {:ok, id} <- Danton.Guardian.resource_from_claims(claims)
        do
          id
        else
          _ -> nil
        end
      end
    end
  end
end
