defmodule Danton.Authorization do
  use Danton.Web, :model

  # ===========================
  # ECTO CONFIG
  # ===========================

  schema "authorization" do
    field :provider, :string
    field :uid, :string
    field :token, :string
    field :refresh_token, :string
    field :expires_at, :integer
    field :password, :string, virtual: true
    field :password_confirmation, :string, virtual: true

    belongs_to :user, User

    timestamps()
  end

  @required_fields ~w(provider uid user_id token)a
  @optional_fields ~w(refresh_token expires_at)a

  @doc """
  Creates a changeset based on the `model` and `params`.
  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields ++ @optional_fields)
    |> validate_required(@required_fields)
    |> foreign_key_constraint(:user_id)
    |> unique_constraint(:provider_uid)
  end

  def validate_password_and_confirmation(pw, pwc) do
    case validate_password(pw) do
      :ok -> validate_pw_confirmation(pw, pwc)
      res -> res
    end
  end

  def validate_password(pw) do
    if String.length(pw) >= 6 do
      :ok
    else
      {:error, :password_length_is_less_than_6}
    end
  end

  def validate_pw_confirmation(pw, pwc) do
    if pw == pwc do
      :ok
    else
      {:error, :password_does_not_match}
    end
  end
end
