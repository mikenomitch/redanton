defmodule Danton.MembershipController do
  use Danton.Web, :controller

  plug Guardian.Plug.EnsureAuthenticated, handler: __MODULE__, typ: "access"

  # ===========================
  # ACTIONS
  # ===========================

  def index(conn, %{"club_id" => club_id}) do
    club = Repo.get(Club, club_id)
    memberships = Membership.for_club(club_id)
      |> Repo.all()
      |> Repo.preload(:user)

    conn
    |> add_club_crumb(club)
    |> add_club_membership_crumb(club)
    |> render("index.html", memberships: memberships, club: club)
  end

  def new(conn, %{"club_id" => club_id}) do
    club = Repo.get(Club, club_id)
    changeset = Membership.changeset(%Danton.Membership{})

    conn
    |> add_club_crumb(club)
    |> add_club_membership_crumb(club)
    |> add_new_membership_crumb(club)
    |> render("new.html", changeset: changeset, club: club)
  end

  def create(conn, %{"membership" => %{"email" => ""}, "club_id" => club_id}) do
    club = Repo.get(Club, club_id)

    conn
    |> add_club_crumb(club)
    |> add_club_membership_crumb(club)
    |> add_new_membership_crumb(club)
    |> put_flash(:error, "Email cannot be blank")
    |> render("new.html", club: club, changeset: Membership.changeset(%Danton.Membership{}))
  end

  def create(conn, %{"membership" => membership_params, "club_id" => club_id}) do
    %{"email" => email} = membership_params
    user = User.get_or_create_by_email(email)
    club = Repo.get(Club, club_id)
    membership_params = %{club: club, type: "standard", status: "pending", email: email}

    cs = Ecto.build_assoc(user, :memberships, membership_params)

    with {:ok, _ } <- email_not_nil(cs),
        {:ok, _ } <- email_has_format(cs),
        {:ok, _membership } <- Membership.invite_and_notify(cs)
    do
      conn
      |> put_flash(:info, "Invite Sent.")
      |> redirect(to: club_membership_path(conn, :index, club_id))
    else
      {:error, changeset} ->
        render_error(conn, club)
      {:error_message, message} ->
        render_error(conn, club, message)
    end
  end

  defp render_error(conn, club, message \\ "There was an issue") do
    conn
    |> add_club_crumb(club)
    |> add_club_membership_crumb(club)
    |> add_new_membership_crumb(club)
    |> put_flash(:error, message)
    |> render("new.html", club: club, changeset: Membership.changeset(%Danton.Membership{}))
  end

  # THESE ARE AWFUL AND SHOULD GO ON THE MODEL
  # AND BE CALLED VIA ECTO CS

  def email_not_nil(cs) do
    if (cs.email && cs.email != "") do
      {:ok, cs}
    else
      {:error_message, "Email not valid"}
    end
  end

  def email_has_format(cs) do
    if (String.contains?(cs.email, "@")) do
      {:ok, cs}
    else
      {:error_message, "Email not valid"}
    end
  end

  def show(conn, %{"id" => id}) do
    membership = Repo.get!(Membership, id)
    render(conn, "show.html", membership: membership)
  end

  def edit(conn, %{"id" => id}) do
    membership = Repo.get!(Membership, id)
    changeset = Membership.changeset(membership)
    render(conn, "edit.html", membership: membership, changeset: changeset)
  end

  def update(conn, %{"id" => id, "membership" => membership_params}) do
    membership = Repo.get!(Membership, id)
    changeset = Membership.changeset(membership, membership_params)

    case Repo.update(changeset) do
      {:ok, membership} ->
        conn
        |> put_flash(:info, "Membership updated successfully.")
        |> redirect(to: membership_path(conn, :show, membership))
      {:error, changeset} ->
        render(conn, "edit.html", membership: membership, changeset: changeset)
    end
  end

  def elevate(conn, %{"id" => id}) do
    membership = Repo.get!(Membership, id)
    club_id = membership.club_id

    changeset = Membership.changeset(membership, %{type: "admin"})

    case Repo.update(changeset) do
      {:ok, _membership} ->
        conn
        |> put_flash(:info, "Member Now Admin!")
        |> redirect(to: club_membership_path(conn, :index, club_id))
      {:error, _changeset} ->
        conn
        |> put_flash(:error, "There was an issue!")
        |> redirect(to: club_membership_path(conn, :index, club_id))
    end

  end

  def delete(conn, %{"id" => id}) do
    membership = Repo.get!(Membership, id)
    club_id = membership.club_id

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(membership)

    conn
    |> put_flash(:info, "Member kicked!")
    |> redirect(to: club_membership_path(conn, :index, club_id))
  end

  # BREADCRUMBS

  defp add_club_crumb(conn, club) do
    add_breadcrumb(conn, name: club.name, url: "/clubs/" <> Integer.to_string(club.id))
  end

  defp add_club_membership_crumb(conn, club) do
    add_breadcrumb(conn, name: "Members", url: "/clubs/" <> Integer.to_string(club.id) <> "/members")
  end

  defp add_new_membership_crumb(conn, club) do
    add_breadcrumb(conn, name: "Invite", url: "/clubs/" <> Integer.to_string(club.id) <> "/members/new")
  end
end
