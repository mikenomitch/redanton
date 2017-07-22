defmodule Danton.User do
  use Danton.Web, :model

  schema "users" do
    field :name, :string
    field :email, :string
    field :password_hash, :string

    has_many :memberships, Danton.Membership
    many_to_many :clubs, Danton.Club, join_through: "memberships"

    timestamps
  end

  @paramlist ~w(name email password_hash reset_password_token reset_password_sent_at failed_attempts locked_at sign_in_count current_sign_in_at last_sign_in_at current_sign_in_ip last_sign_in_ip unlock_token)

  def changeset(model, params \\ %{}) do
    model
    |> cast(params, @paramlist)
    |> validate_required([:name, :email, :password_hash])
    |> validate_format(:email, ~r/@/)
    |> unique_constraint(:email)
  end
end
