defmodule Danton.Repo.Migrations.CreatePost do
  use Ecto.Migration

  def change do
    create table(:posts) do
      add :title, :string
      add :description, :text
      add :type, :string
      add :url, :string
      add :channel_id, references(:channels, on_delete: :nothing)
      add :user_id, references(:users, on_delete: :nothing)

      timestamps()
    end
    create index(:posts, [:channel_id])
    create index(:posts, [:user_id])

  end
end
