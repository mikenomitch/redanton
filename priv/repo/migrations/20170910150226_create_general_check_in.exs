defmodule Danton.Repo.Migrations.CreateGeneralCheckIn do
  use Ecto.Migration

  def change do
    create table(:general_check_ins) do
      add :type, :string
      add :user_id, references(:users, on_delete: :nothing)

      timestamps()
    end

    create index(:general_check_ins, [:user_id])
  end
end
