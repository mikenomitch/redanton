defmodule Danton.Controller.Helpers do
  import Plug.Conn

  def redirect_back(conn, alternative \\ "/") do
    path = conn
    |> get_req_header("referer")
    |> referrer
    path || alternative
  end

  defp referrer([]), do: nil
  defp referrer([h|_]), do: h

  defmacro __using__(:auth) do
    quote do
      def unauthenticated(conn, _params) do
        conn
        |> put_flash(:error, "Authentication required")
        |> redirect(to: Danton.Router.Helpers.auth_path(conn, :login))
      end
    end
  end


  defmacro __using__(:no_items_rendering) do
    quote do
      def index_template(user) do
        ( Danton.Club.user_has_none(user) && :no_clubs )
        || ( Danton.Channel.user_has_none(user) && :no_channels )
        || ( Danton.Post.user_has_none(user) && :no_posts )
        || :main
      end

      def render_no_clubs(conn) do
        render(conn, Danton.PageView, "no_clubs.html")
      end

      def render_no_channels(conn) do
        render(conn, Danton.PageView, "no_channels.html")
      end

      def render_no_posts(conn) do
        render(conn, Danton.PageView, "no_posts.html")
      end
    end
  end
end
