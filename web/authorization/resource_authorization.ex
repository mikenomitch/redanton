defmodule Danton.WebAuthorization do
  import Phoenix.Controller
  import Plug.Conn

  def init(opts), do: opts

  def call(conn, [resource_type, permission_type]) do
    case Danton.AuthorizationRouter.user_resource_status(conn, resource_type, permission_type) do
      :visible ->
        conn
      :not_found ->
        render_not_found(conn)
      :unauthorized ->
        render_unauthorized(conn)
    end
  end

  defp render_unauthorized(conn) do
    conn
    |> put_flash(:error, "Log in to see this page")
    |> redirect(to: "/login")
  end

  defp render_not_found(conn) do
    conn
    |> put_status(:not_found)
    |> render(Danton.PageView, "not_found.html")
    |> halt
  end
end

defmodule Danton.ApiAuthorization do
  import Phoenix.Controller
  import Plug.Conn

  def init(opts), do: opts

  def call(conn, [resource_type, permission_type]) do
    case Danton.AuthorizationRouter.user_resource_status(conn, resource_type, permission_type) do
      :visible ->
        conn
      :not_found ->
        return_not_found_error(conn)
      :unauthorized ->
        return_unauthorized_error(conn)
    end
  end

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

defmodule Danton.AuthorizationRouter do
  def user_resource_status(conn, resource_type, permission_type) do
    auth_module = case resource_type do
      :club ->
        Danton.ClubAuthorization
      :channel ->
        Danton.ChannelAuthorization
      :post ->
        Danton.PostAuthorization
      :admin ->
        Danton.AdminAuthorization
      _ ->
        Danton.AlwaysSuccessfulAuthorization
    end

    current_user = Danton.Guardian.Plug.current_resource(conn)
    auth_module.authorization_status(conn, current_user, permission_type)
  end
end
