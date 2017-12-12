defmodule Danton.Repo.Migrations.CreateNotification do
  use Ecto.Migration

  def change do
    create table(:notifications) do
      add :status, :string
      add :type, :string
      add :data, :map

      add :user_id, references(:users, on_delete: :nothing)

      timestamps()
    end
    create index(:notifications, [:user_id])

  end
end
