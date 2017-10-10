# TODO:
# - Move most of this out of the macro
# - See if you even need a macro (probably not)
# - Split each child into a different file
# - make admin auth use this plug as well

defmodule Danton.ResourceAuthorization do
  import Phoenix.Controller

  defmacro __using__(:controller) do
    quote do
      def authorize_web_resource(conn, [resource_type, permission_type]) do
        case user_resource_status(conn, resource_type, permission_type) do
          :visible ->
            conn
          :not_found ->
            render_not_found(conn)
          :unauthorized ->
            render_unauthorized(conn)
        end
      end

      def authorize_api_resource(conn, [resource_type, permission_type]) do
        case user_resource_status(conn, resource_type, permission_type) do
          :visible ->
            conn
          :not_found ->
            return_not_found_error(conn)
          :unauthorized ->
            return_unauthorized_error(conn)
        end
      end

      # returns :unauthorized, :not_found, or :success
      defp user_resource_status(conn, resource_type, permission_type) do
        auth_module = case resource_type do
          :club ->
            Danton.ClubAuthorization
          :channel ->
            Danton.ChannelAuthorization
          :post ->
            Danton.PostAuthorization
          _ ->
            Danton.AlwaysSuccessfulAuthorization
        end

        current_user = Guardian.Plug.current_resource(conn)
        auth_module.authorization_status(conn, current_user, permission_type)
      end

      # ===============
      # ERROR RENDERING
      # ===============

      # web

      defp render_unauthorized(conn) do
        conn
        |> put_status(:unauthorized)
        |> render(Danton.PageView, "unauthorized.html")
        |> halt
      end

      defp render_not_found(conn) do
        conn
        |> put_status(:not_found)
        |> render(Danton.PageView, "not_found.html")
        |> halt
      end

      # api

      defp return_not_found_error(conn) do
        conn
        |> put_status(:not_found)
        |> json(%{error: "Resource not found."})
        |> halt
      end

      defp return_unauthorized_error(conn) do
        conn
        |> put_status(:unauthorized)
        |> json(%{error: "Unauthorized."})
        |> halt
      end
    end
  end
end

# ==== CLUBS ====

defmodule Danton.ClubAuthorization do
  def authorization_status(conn, user, permission_type) do
    club_id = get_resource_id(conn)
    case permission_type do
      :view ->
        get_view_authorization(user, club_id)
      :edit ->
        get_edit_authorization(user, club_id)
    end
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
    Danton.Club.get_user_club(user, club_id)
  end

  defp is_admin(user, club_id) do
    Danton.Membership.user_is_admin(user, club_id)
  end
end

# ==== CHANNELS ====

defmodule Danton.ChannelAuthorization do
  def authorization_status(conn, user, permission_type) do
    channel_id = get_resource_id(conn)
    case permission_type do
      :view ->
        get_view_authorization(user, channel_id)
      :edit ->
        get_edit_authorization(user, channel_id)
    end
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
    Danton.Channel.for_user(user) |> Danton.Repo.get(channel_id)
  end
end

# ==== POSTS ====

defmodule Danton.PostAuthorization do
  def authorization_status(conn, user, permission_type) do
    post_id = get_resource_id(conn)
    case permission_type do
      :view ->
        get_view_authorization(user, post_id)
      :edit ->
        get_edit_authorization(user, post_id)
    end
  end

  defp get_resource_id(conn) do
    conn.path_params && (conn.path_params["post_id"] || conn.path_params["id"])
  end

  defp get_view_authorization(user, post_id) do
    if has_post(user, post_id) do
      :visible
    else
      :not_found
    end
  end

  defp get_edit_authorization(user, post_id) do
    if is_post_owner(user, post_id) do
      :visible
    else
      :not_found
    end
  end

  defp has_post(user, post_id) do
    Danton.Post.user_posts(user) |> Danton.Repo.get(post_id)
  end

  defp is_post_owner(user, post_id) do
    Danton.Repo.get_by(Danton.Message, user_id: user.id, id: post_id)
  end
end

# ==== ALWAYS SHOW ====

defmodule Danton.AlwaysSuccessfulAuthorization do
  def authorization_status(conn, user, permission_type) do
    :visible
  end
end
