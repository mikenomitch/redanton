defmodule Danton.PostAuthorization do
  alias Danton.Repo
  alias Danton.Post

  def authorization_status(conn, user = %Danton.User{}, permission_type) do
    post_id = get_resource_id(conn)
    case permission_type do
      :view ->
        get_view_authorization(user, post_id)
      :edit ->
        get_edit_authorization(user, post_id)
    end
  end

  def authorization_status(_conn, _user = nil, _permission_type) do
    :unauthorized
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
    Post.user_posts(user) |> Repo.get(post_id)
  end

  defp is_post_owner(user, post_id) do
    Repo.get_by(Post, user_id: user.id, id: post_id)
  end
end

# ==== ALWAYS SHOW ====

defmodule Danton.AlwaysSuccessfulAuthorization do
  def authorization_status(_conn, _user, _permission_type) do
    :visible
  end
end
