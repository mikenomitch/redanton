defmodule Danton.Membership do
  use Danton.Web, :model

  # ===========================
  # ECTO CONFIG
  # ===========================

  schema "memberships" do
    field :status, :string
    field :type, :string
    belongs_to :user, User
    belongs_to :club, Club

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:status, :type])
    |> validate_required([:status, :type])
  end

  # ===========================
  # CREATION
  # ===========================

  def invite_and_notify(cs) do
    case Repo.insert(cs) do
      {:ok, membership} ->
        Task.start(__MODULE__, :notify_new_club_invite, [membership])
        {:ok, membership}
      {:error, changeset} ->
        {:error, changeset}
    end

  end

  # ===========================
  # QUERIES
  # ===========================

  def of_type(query \\ Membership, type) do
    from(m in query, where: m.type == ^type)
  end

  def for_club(%Danton.Club{} = club) do
    club |> Ecto.assoc(:memberships)
  end

  def for_club(query \\ Membership, club_id) do
    from(m in query, where: m.club_id == ^club_id)
  end

  def for_user(user) do
    user |> Ecto.assoc(:memberships)
  end

  # ===========================
  # OTHER
  # ===========================

  def user_is_admin(user, club_id) do
    for_user(user)
    |> for_club(club_id)
    |> of_type("admin")
    |> Repo.one()
  end

  def notify_new_club_invite(membership) do
    club = Repo.get(Club, membership.club_id)

    Danton.Notification.notify_user(
      membership.user_id,
      :new_club_invite,
      %{
        club_name: club.name,
        site_url: "https://stormy-reef-53700.herokuapp.com"
      }
    )
  end
end
