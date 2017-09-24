defmodule Danton.Api.V1.UserView do
	use Danton.Web, :view

	def render("index.json", %{users: users}) do
    %{users: Enum.map(users, &user_json/1)}
	end

	defp user_json(user) do
		%{id: user.id, name: user.name, avatar: user.avatar}
	end
end
