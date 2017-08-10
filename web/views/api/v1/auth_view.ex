defmodule Danton.Api.V1.AuthView do
	use Danton.Web, :view

	def render("login.json", %{user: user, jwt: jwt, exp: exp}) do
    %{user: %{id: user.id, name: user.name, email: user.email, avatar: user.avatar}, jwt: jwt, exp: exp}
  end
end
