defmodule Danton.Api.V1.UserController do
  use Danton.Web, :controller

	alias Danton.Club
	alias Danton.Post

  # ===========================
  # ACTIONS
  # ===========================

  def index(conn, %{"club_id" => club_id}, _current_user, _claims) do
		users = Club.users_for_club(club_id)
		render(conn, "index.json", users: users)
  end

  def index(conn, %{"post_id" => post_id}, _current_user, _claims) do
		users = Post.users_for_post(post_id)
		render(conn, "index.json", users: users)
  end

  def index(conn, _params, _current_user, _claims) do
    # TODO: scope this to any of the users in a users's clubs
    # OR remove this and have posts return poster names
		users = Repo.all(User)
		render(conn, "index.json", users: users)
	end
end
