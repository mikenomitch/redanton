defmodule Danton.ClubView do
  use Danton.Web, :view

  def user_is_admin(club, user) do
    Membership.user_is_admin(club, user)
  end
end
