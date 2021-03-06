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
    has_many :notifications, Notification

    many_to_many :clubs, Club, join_through: "memberships"

    timestamps()
  end

  @paramlist ~w(name email status avatar)a
  @required_params ~w(email name)a

  def changeset(model, params \\ %{}) do
    model
    |> cast(params, @paramlist)
    |> update_change(:email, &String.downcase/1)
    |> validate_required(@required_params)
    |> validate_length(:name, min: 1, max: 60)
    |> validate_format(:email, ~r/@/)
    |> unique_constraint(:email)
  end

  # ===========================
  # QUERIES
  # ===========================

  def for_ids(query \\ User, ids) do
    from(u in query, where: u.id in ^ids)
  end

  def for_email(query \\ User, email) do
    from(u in query, where: u.email == ^downcase(email))
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

  def for_message(message) do
    Ecto.assoc(message, :user)
  end

  # ===========================
  # GETTERS
  # ===========================

  def for_post(post_id) do
    post = Repo.get(Post, post_id)
    User.for_clubs([post.club_id])
  end

  def for_room(room_id) do
    room_id
      |> Room.pluck_post_id()
      |> User.for_post()
  end

  # ===========================
  # OTHER
  # ===========================

  def get_or_create_by_email(email) do
    downcased_email = downcase(email)
    Repo.get_by(User, email: downcased_email) || Repo.insert!(%User{ email: downcased_email, status: "pending"})
  end

  def is_admin(user) do
    user.email == "mikenomitch@gmail.com"
  end

  # =====================================
  # TODO: EXTRACT USER UPDATES INTO OWN MODULE
  # =====================================

  # TODO: this is gross... figure out the idiomatic
  # way of doing this better

  # updates self and potentially authorization
  def update_info_and_auth(current_user, params) do
    case update_authorization_if_needed_and_valid(params) do
      {:ok, _auth} ->
        user = Repo.get!(User, current_user.id)
        changeset = User.changeset(user, params)
        Repo.update(changeset)
      err -> err
    end
  end

  defp update_authorization_if_needed_and_valid(params) do
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

  # =====================================
  # TODO: EXTRACT AUTH STUFF INTO OWN MODULE
  # =====================================

  def send_password_reset(user) do
    {:ok, token, _claims} = Danton.Guardian.encode_and_sign(
      user,
      %{},
      token_type: "reset",
      token_ttl: {30, :minute}
    )

    Danton.Communication.notify_via_email(user, :password_reset, %{token: token})
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

  # TODO: make nicer - perhaps with a when
  def create_user_and_authorization(params) do
    case update_or_create(params) do
      {:ok, user} ->
        case make_user_auth(user, params) do
          {:ok, _auth} -> user
          err -> err
        end
      err -> err
    end
  end

  defp update_or_create(params) do
    user = Repo.get_by(User, email: downcase(params["email"]), status: "pending")

    if user do
      full_loaded_user = user
        |> Repo.preload(:memberships)
        |> Repo.preload(:authorizations)

      attrs = %{
        status: "active",
        avatar: "",
        name: params["name"]
      }

      User.changeset(full_loaded_user, attrs) |> Repo.update()
    else
      usr_params = %{
        email: downcase(params["email"]),
        name: params["name"],
        status: "active",
        avatar: ""
      }

      User.changeset(%User{}, usr_params) |> Repo.insert()
    end
  end

  defp make_user_auth(user, params) do
    %Danton.Authorization{
      uid: downcase(user.email),
      provider: "identity",
      token: Comeonin.Bcrypt.hashpwsalt(params["password"]),
      user_id: user.id
    } |> Repo.insert()
  end

  # =================================
  # =================================

  # TODO: figure out if you can just use changeset above
  def registration_changeset(model, params \\ :empty) do
    model
    |> cast(params, [:name, :email])
    |> update_change(:email, &String.downcase/1)
    |> validate_required(@required_params)
    |> validate_length(:name, min: 1)
    |> validate_format(:email, ~r/@/)
    |> unique_constraint(:email)
  end

  def validate_email(email) do
    case Regex.run(~r/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/, email) do
      nil ->
        {:error, :invalid_email}
      [_email] ->
        :ok
    end
  end

  def validate_sign_up_params(params) do
    case validate_email(params["email"]) do
      :ok -> Authorization.validate_password_and_confirmation(params["password"], params["password_confirmation"])
      res -> res
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
    auth = Authorization |> Repo.get_by(uid: downcase(uuid))
    {:ok, auth}
  end

  defp parse_email(params) do
    if params["email"] do
      {:ok, downcase(params["email"])}
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

  defp downcase(str) do
    String.downcase(str)
  end
end
