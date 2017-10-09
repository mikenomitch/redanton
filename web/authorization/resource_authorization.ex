defmodule Danton.ResourceAuthorization do
  import Phoenix.Controller

  defmacro __using__(:controller) do
    quote do
      def authorize_web_resource(conn, [resource_type, permission_type]) do
        case resource_type do
          :club ->
            conn
          :channel ->
            conn
          :post ->
            conn
          _ ->
            render_unauthorized(conn)
        end
      end

      def authorize_api_resource(conn, [resource_type, permission_type]) do
        case resource_type do
          :club ->
            conn
          :channel ->
            conn
          :post ->
            conn
          _ ->
            conn
            |> put_status(:unauthorized)
            |> json(%{error: "Not Logged In."})
        end
      end

      defp render_unauthorized(conn) do
        conn
        |> put_status(:unauthorized)
        |> render(Danton.PageView, "not_found.html")
        |> halt
      end

      defp render_not_found(conn) do
        conn
        |> put_status(:not_found)
        |> render(Danton.PageView, "not_found.html")
        |> halt
      end
    end
  end
end

# todos
#  - add modules for each resource type
#  - add todos for other resources but
#    mull it over before adding them
#  - make mobile handle 403's more gracefully
#  - confirm check ins happenining post auth