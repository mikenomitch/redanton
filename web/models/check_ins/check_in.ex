# TODO: make all of these async

defmodule Danton.CheckIn do
  import Ecto.Query, only: [from: 2]

  defmacro __using__(:controller) do
    quote do
      def check_in(conn, :front_page) do
        user_id = get_user_id(conn)

        if (user_id) do
          Danton.GeneralCheckIn.changeset(
            %Danton.GeneralCheckIn{},
            %{user_id: user_id, type: "front"}
          ) |> Danton.Repo.insert
        end

        conn
      end

      def check_in(conn, :post) do
        user_id = get_user_id(conn)
        post_id = conn.params["id"]

        if (user_id) do
          Danton.PostCheckIn.changeset(
            %Danton.PostCheckIn{},
            %{user_id: user_id, post_id: post_id}
          ) |> Danton.Repo.insert
        end

        conn
      end

      def check_in(conn, :channel) do
        user_id = get_user_id(conn)
        channel_id = conn.params["channel_id"]

        if (user_id && channel_id) do
          Danton.ChannelCheckIn.changeset(
            %Danton.ChannelCheckIn{},
            %{user_id: user_id, channel_id: channel_id}
          ) |> Danton.Repo.insert
        end

        conn
      end

      defp get_user_id(%{private: private_params}) do
        private_params.guardian_default_resource && private_params.guardian_default_resource.id
      end
    end
  end

  def check_in_room(room, user) do
    Danton.RoomCheckIn.changeset(
      %Danton.RoomCheckIn{},
      %{user_id: user.id, room_id: room.id}
    ) |> Danton.Repo.insert
  end

  def users_checked_in_since(time, %{id: id, type: :room}) do
    # TODO: get this working with the right attrs
    # saved onto the table/model
    query = from c in Danton.RoomCheckIn, where: c.inserted_at > ^time and c.room_id == ^id, select: map(c, [:user_id])
    Danton.Repo.all(query)
  end
end
