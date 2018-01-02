defmodule Danton.Repo.Migrations.ReplaceChannelIdIndexWithClubId do
  use Ecto.Migration

  def up do
    create index(:posts, [:club_id])
    drop index(:posts, [:channel_id])
  end

  def down do
    drop index(:posts, [:club_id])
    create index(:posts, [:channel_id])
  end
end
