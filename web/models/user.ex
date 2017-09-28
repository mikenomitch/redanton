defmodule Danton.User do
  use Danton.Web, :model

  # ===========================
  # ECTO CONFIG
  # ===========================

  schema "users" do
    field :name, :string
    field :email, :string
    field :avatar, :string
    field :status, :string

    has_many :memberships, Membership
    has_many :authorizations, Authorization
    many_to_many :clubs, Club, join_through: "memberships"

    timestamps()
  end

  @paramlist ~w(name email status avatar)a
  @required_params ~w(email name status)a

  def changeset(model, params \\ %{}) do
    model
    |> cast(params, @paramlist)
    |> validate_required(@required_params)
    |> validate_format(:email, ~r/@/)
    |> unique_constraint(:email)
  end

  # ===========================
  # QUERIES
  # ===========================

  def for_ids(query \\ User, ids) do
    from(u in query, where: u.id in ^ids)
  end

  def for_clubs(query \\ User, club_ids) do
    from u in query,
      join: c in assoc(u, :clubs),
      where: c.id in ^club_ids
  end

  def for_memberships(query \\ User, membership_ids) do
    from u in query,
      join: m in assoc(u, :memberships),
      where: m.id in ^membership_ids
  end

  def for_auth(auth) do
    Ecto.assoc(auth, :user)
  end

  # ===========================
  # GETTERS
  # ===========================

  def for_post(post_id) do
    post = Repo.get(Post, post_id)
    channel = Repo.get(Channel, post.channel_id)
    User.for_clubs([channel.club_id])
  end

  def for_room(room_id) do
    room_id
      |> Room.pluck_post_id()
      |> User.for_post()
  end

  # ===========================
  # OTHER
  # ===========================

  def get_or_create(params) do
    Repo.get_by(User, email: params.email) || Repo.insert!(%User{ params | status: "pending"})
  end

  # TODO: this is gross... figure out the idiomatic
  # way of doing this better

  # updates self and potentially authorization
  def update_info_and_auth(current_user, params) do
    case update_authorization_if_needed(params) do
      {:ok, _auth} ->
        user = Repo.get!(User, current_user.id)
        changeset = User.changeset(user, params)
        Repo.update(changeset)
      {:error, reason} ->
        {:error, reason}
    end
  end

  defp update_authorization_if_needed(params) do
    if params_have_password(params) do
      Authorization.update_authorization_for_user_params(params)
    else
      {:ok, :no_auth_update_needed}
    end
  end

  defp params_have_password(params) do
    params["password"] && params["password"] != "" &&
      params["password_confirmation"] && params["password_confirmation"] != ""
  end

  def sign_up(params) do
    case validate_sign_up_params(params) do
      :ok ->
        case Repo.transaction(fn -> create_user_and_authorization(params) end) do
          {:ok, user} -> {:ok, user}
          {:error, reason} -> {:error, reason}
          _ -> {:error, :there_was_an_error}
        end
      {:error, reason} -> {:error, reason}
    end
  end

  def create_user_and_authorization(params) do
    {:ok, user} = %Danton.User{
      name: params["name"],
      status: "active",
      email: params["email"],
      avatar: ""
    } |> Repo.insert()

    {:ok, _authorization} = %Danton.Authorization{
      uid: user.email,
      provider: "identity",
      token: Comeonin.Bcrypt.hashpwsalt(params["password"]),
      user_id: user.id
    } |> Repo.insert()

    user
  end

  def validate_sign_up_params(params) do
    case validate_email(params["email"]) do
      :ok -> Authorization.validate_password_and_confirmation(params["password"], params["password_confirmation"])
      res -> res
    end
  end

  # TODO: figure out if you can just use changeset above
  def registration_changeset(model, params \\ :empty) do
    model |> cast(params, [:name, :email])
  end

  def validate_email(email) do
    case Regex.run(~r/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/, email) do
      nil ->
        {:error, :invalid_email}
      [_email] ->
        :ok
    end
  end

  def find_and_confirm_password(params) do
    with {:ok, uuid} <- parse_email(params),
    {:ok, password} <- parse_password(params),
    {:ok, auth} <- get_auth(uuid),
    {:ok, _} <- check_password(auth.token, password) do
      user = User.for_auth(auth) |> Repo.one
      {:ok, user}
    else
      _ -> {:error, "Invalid Credentials"}
    end
  end

  defp get_auth(uuid) do
    auth = Authorization |> Repo.get_by(uid: uuid)
    {:ok, auth}
  end

  defp parse_email(params) do
    if params["email"] do
      {:ok, params["email"]}
    end
  end

  defp parse_password(params) do
    if params["password"] do
      {:ok, params["password"]}
    end
  end

  defp check_password(token, password) do
    if Comeonin.Bcrypt.checkpw(password, token) do
      {:ok, "Password Matches"}
    end
  end
end
