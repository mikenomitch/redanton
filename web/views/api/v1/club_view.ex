defmodule Danton.Api.V1.ClubView do
  use Danton.Web, :view

  def render("index.json", %{clubs: clubs}) do
    %{data: render_many(clubs, Danton.Api.V1.ClubView, "club.json")}
  end

  def render("show.json", %{club: club}) do
    %{data: render_one(club, Danton.Api.V1.ClubView, "club.json")}
  end

  def render("club.json", %{club: club}) do
    %{
      id: club.id,
      name: club.name,
      description: club.description
    }
  end
end
