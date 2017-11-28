defmodule Danton.Repo.Migrations.AddActivityToPosts do
  use Ecto.Migration

  def change do
    alter table(:posts) do
      add :activity_at, :datetime
    end
  end
end
