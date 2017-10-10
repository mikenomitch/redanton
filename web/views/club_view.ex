defmodule Danton.ClubView do
  use Danton.Web, :view

  def user_is_admin(user, club_id) do
    Membership.user_is_admin(user, club_id)
  end
end
