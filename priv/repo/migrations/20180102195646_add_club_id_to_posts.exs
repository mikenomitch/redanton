defmodule Danton.Repo.Migrations.AddClubIdToPosts do
  use Ecto.Migration

  def up do
    alter table(:posts) do
      add :club_id, references(:clubs, on_delete: :nothing)
    end
  end

  def down do
    alter table(:posts) do
      remove :club_id
    end
  end
end