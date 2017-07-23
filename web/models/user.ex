defmodule Danton.User do
  use Danton.Web, :model

  schema "users" do
    field :name, :string
    field :email, :string
    field :avatar, :string

    has_many :memberships, Danton.Membership
    has_many :authorizations, Danton.Authorization
    many_to_many :clubs, Danton.Club, join_through: "memberships"

    timestamps
  end

  @paramlist ~w(name email avatar)
  @required_params ~w(email name)

  def changeset(model, params \\ %{}) do
    model
    |> cast(params, @paramlist)
    |> validate_required(@required_params)
    |> validate_format(:email, ~r/@/)
    |> unique_constraint(:email)
  end

  # TODO: figure out if you can just use changeset above
  def registration_changeset(model, params \\ :empty) do
    model |> cast(params, [:name, :email])
  end
end
