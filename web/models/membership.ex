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

  def for_user(user) do
    user |> Ecto.assoc(:memberships)
  end

  def for_club(club) do
    club |> Ecto.assoc(:memberships)
  end

  # ===========================
  # OTHER
  # ===========================

  def notify_new_club_invite(membership) do
    club = Repo.get(Club, membership.club_id)

    Danton.Notification.notify_user(
      membership.user_id,
      :new_club_invite,
      %{club: club}
    )
  end
end
