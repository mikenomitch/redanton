defmodule Danton.ClubTest do
  use Danton.ModelCase

  alias Danton.Club

  @valid_attrs %{description: "some content", name: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = Club.changeset(%Club{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = Club.changeset(%Club{}, @invalid_attrs)
    refute changeset.valid?
  end
end
