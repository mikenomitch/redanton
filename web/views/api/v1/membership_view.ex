defmodule Danton.Api.V1.MembershipView do
  use Danton.Web, :view

  def render("index.json", %{memberships: memberships}) do
    %{data: render_many(memberships, Danton.Api.V1.MembershipView, "membership.json")}
  end

  def render("show.json", %{membership: membership}) do
    %{data: render_one(membership, Danton.Api.V1.MembershipView, "membership.json")}
  end

  def render("membership.json", %{membership: membership}) do
    %{id: membership.id}
  end
end
