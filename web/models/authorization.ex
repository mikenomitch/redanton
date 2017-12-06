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
      err -> err
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

  def validate_current_password(uid, current_pw) do
    auth = Repo.get_by(Authorization, uid: uid)

    if  Comeonin.Bcrypt.checkpw(current_pw, auth.token) do
      :ok
    else
      {:error, :old_password_does_not_match}
    end
  end

  def update_authorization_for_user_params(%{"password" => pw, "password_confirmation" => pwc, "email" => uid, "current_password" => cpw}) do
    with :ok <- validate_password_and_confirmation(pw, pwc),
         :ok <- validate_current_password(uid, cpw)
    do
      auth = Repo.get_by(Authorization, uid: uid)
      cs = Authorization.changeset(
        auth,
        %{token: Comeonin.Bcrypt.hashpwsalt(pw)}
      )
      Repo.update(cs)
    else
      err -> err
    end
  end
end
