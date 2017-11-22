defmodule Danton.Repo.Migrations.AddActivityToPosts do
  use Ecto.Migration

  def up do
    alter table(:posts) do
      add :activity_at, :datetime
    end
  end

  def down do
    alter table(:posts) do
      remove :activity_at
    end
  end
end
