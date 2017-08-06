defmodule Danton.Api.V1.UserController do
  use Danton.Web, :controller

  def index(conn, %{"club_id" => club_id}, _current_user, _claims) do
		users = Danton.Club.users_for_club(club_id)
		IO.puts(hd(users).name)
		render(conn, "index.json", users: users)
	end
end
