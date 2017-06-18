defmodule Danton.Repo.Migrations.CreateChannel do
  use Ecto.Migration

  def change do
    create table(:channels) do
      add :name, :string
      add :description, :text
      add :club_id, references(:clubs, on_delete: :nothing)

      timestamps()
    end
    create index(:channels, [:club_id])

  end
end
