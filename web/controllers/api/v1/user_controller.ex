defmodule Danton.Api.V1.UserController do
  use Danton.Web, :controller

  def index(conn, %{"club_id" => club_id}, _current_user, _claims) do
		users = Danton.Club.users_for_club(club_id)
		render(conn, "index.json", users: users)
  end

  def index(conn, %{"post_id" => post_id}, _current_user, _claims) do
		users = Danton.Post.users_for_post(post_id)
		render(conn, "index.json", users: users)
	end
end
