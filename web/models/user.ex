defmodule Danton.User do
  use Danton.Web, :model

  # ===========================
  # ECTO CONFIG
  # ===========================

  schema "users" do
    field :name, :string
    field :email, :string
    field :avatar, :string

    has_many :memberships, Membership
    has_many :authorizations, Authorization
    many_to_many :clubs, Club, join_through: "memberships"

    timestamps()
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

  # ===========================
  # QUERIES
  # ===========================

  # def for_clubs(club_ids) do
    # TODO: change the non-query below
    # when you make this one
  # end

  # def for_memberships(club_ids) do
  # end

  # ===========================
  # GETTERS
  # ===========================

  # TODO: replace w/ query
  def for_clubs(club_ids) do
    Membership.for_clubs(club_ids)
    |> Ecto.assoc(:user)
    |> Repo.all
  end

  defp get_auth(uuid) do
    auth = Authorization |> Repo.get_by(uid: uuid)
    {:ok, auth}
  end

  # TODO: make this just a pluck
  def club_ids_for_user(user) do
    Club.ids_for_user(user)
  end

  def for_auth(auth) do
    Repo.one Ecto.assoc(auth, :user)
  end

  def for_post(post_id) do
    post = Repo.get(Post, post_id)
    Channel.users_for_channel(post.channel_id)
  end

  def for_room(room_id) do
    room_id
      |> Room.pluck_post_id()
      |> User.for_post()
  end

  # ===========================
  # OTHER
  # ===========================

  # TODO: figure out if you can just use changeset above
  def registration_changeset(model, params \\ :empty) do
    model |> cast(params, [:name, :email])
  end

  def find_and_confirm_password(params) do
    with {:ok, uuid} <- parse_email(params),
         {:ok, password} <- parse_password(params),
         {:ok, auth} <- get_auth(uuid),
         {:ok, _} <- check_password(auth.token, password) do
      user = User.for_auth(auth)
      {:ok, user}
    else
      _ -> {:error, "Invalid Credentials"}
    end
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
