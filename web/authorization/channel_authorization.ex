defmodule Danton.ChannelAuthorization do
  alias Danton.Repo
  alias Danton.Channel

  def authorization_status(conn, user = %Danton.User{}, permission_type) do
    channel_id = get_resource_id(conn)
    case permission_type do
      :view ->
        get_view_authorization(user, channel_id)
      :edit ->
        get_edit_authorization(user, channel_id)
    end
  end

  def authorization_status(_conn, user = nil, _permission_type) do
    :unauthorized
  end

  defp get_resource_id(conn) do
    conn.path_params && (conn.path_params["channel_id"] || conn.path_params["id"])
  end

  defp get_view_authorization(user, channel_id) do
    get_authorization(user, channel_id)
  end

  defp get_edit_authorization(user, channel_id) do
    get_authorization(user, channel_id)
  end

  defp get_authorization(user, channel_id) do
    if has_channel(user, channel_id) do
      :visible
    else
      :not_found
    end
  end

  defp has_channel(user, channel_id) do
    Channel.for_user(user) |> Repo.get(channel_id)
  end
end
