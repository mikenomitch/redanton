defmodule Danton.AdminAuthorization do
  alias Danton.User

  def authorization_status(conn, _user, _permission_type) do
    current_user = Danton.Guardian.Plug.current_resource(conn)

    if User.is_admin(current_user) do
      :visible
    else
      :not_found
    end
  end
end
