defmodule Danton.AdminAuthorization do
  alias Danton.User

  def authorization_status(conn, user, permission_type) do
    current_user = Guardian.Plug.current_resource(conn)

    if User.is_admin(current_user) do
      :visible
    else
      :not_found
    end
  end
end
