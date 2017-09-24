defmodule Danton.Repo.Migrations.CreateMembership do
  use Ecto.Migration

  def change do
    create table(:memberships) do
      add :status, :string
      add :type, :string
      add :user_id, references(:users, on_delete: :nothing)
      add :club_id, references(:clubs, on_delete: :nothing)

      timestamps()
    end
    create index(:memberships, [:user_id])
    create index(:memberships, [:club_id])

  end
end
