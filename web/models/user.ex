defmodule Danton.User do
  use Danton.Web, :model

  schema "users" do
    field :name, :string
    field :email, :string
    coherence_schema

    has_many :memberships, Danton.Membership
    many_to_many :clubs, Danton.Club, join_through: "memberships"

    timestamps
  end

  def changeset(model, params \\ %{}) do
    model
    |> cast(params, [:name, :email] ++ coherence_fields)
    |> validate_required([:name, :email])
    |> validate_format(:email, ~r/@/)
    |> unique_constraint(:email)
    |> validate_coherence(params)
  end
end
