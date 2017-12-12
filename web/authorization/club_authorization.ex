defmodule Danton.ClubAuthorization do
  alias Danton.Club
  alias Danton.Membership

  def authorization_status(conn, user = %Danton.User{}, permission_type) do
    club_id = get_resource_id(conn)
    case permission_type do
      :view ->
        get_view_authorization(user, club_id)
      :edit ->
        get_edit_authorization(user, club_id)
    end
  end

  def authorization_status(_conn, _user = nil, _permission_type) do
    :unauthorized
  end

  defp get_resource_id(conn) do
    conn.path_params && (conn.path_params["club_id"] || conn.path_params["id"])
  end

  defp get_view_authorization(user, club_id) do
    if has_club(user, club_id) do
      :visible
    else
      :not_found
    end
  end

  defp get_edit_authorization(user, club_id) do
    if is_admin(user, club_id) do
      :visible
    else
      :not_found
    end
  end

  defp has_club(user, club_id) do
    Club.get_user_club(user, club_id)
  end

  defp is_admin(user, club_id) do
    Membership.user_is_admin(user, club_id)
  end
end
