defmodule Danton.Repo.Migrations.CreateChannelCheckIn do
  use Ecto.Migration

  def change do
    create table(:channel_check_ins) do
      add :channel_id, references(:channels, on_delete: :nothing)
      add :user_id, references(:users, on_delete: :nothing)

      timestamps()
    end

    create index(:channel_check_ins, [:channel_id])
    create index(:channel_check_ins, [:user_id])
  end
end
