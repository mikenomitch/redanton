defmodule Danton.Membership do
  use Danton.Web, :model

  # ===========================
  # ECTO CONFIG
  # ===========================

  schema "memberships" do
    field :status, :string
    field :type, :string
    field :email, :string
    belongs_to :user, User
    belongs_to :club, Club

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:status, :type, :email])
    |> update_change(:email, &String.downcase/1)
    |> validate_required([:status, :type, :email])
    |> validate_format(:email, ~r/@/)
  end

  # ===========================
  # CREATION
  # ===========================

  def invite_and_notify(cs) do
    with {:ok, _ } <- none_for_email_and_club(cs),
         {:ok, membership} <- Repo.insert(cs)
    do
      Task.start(__MODULE__, :notify_new_club_invite, [membership])
      {:ok, membership}
    else
      err -> err
    end
  end

  defp none_for_email_and_club(cs) do
    with user <- User.for_email(cs.email) |> Repo.one(),
         membership = %Membership{} <- for_user(user)
          |> for_club(cs.club.id)
          |> Repo.all()
          |> List.first()
    do
      {:error_message, "User already member"}
    else
      _ -> {:ok, "Membership okay"}
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

    Danton.Communication.notify_user(
      membership.user_id,
      :new_club_invite,
      %{
        club_name: club.name
      }
    )
  end
end
