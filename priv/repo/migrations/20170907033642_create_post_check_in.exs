defmodule Danton.Repo.Migrations.CreatePostCheckIn do
  use Ecto.Migration

  def change do
    create table(:post_check_ins) do
      add :post_id, references(:posts, on_delete: :nothing)
      add :user_id, references(:users, on_delete: :nothing)

      timestamps()
    end

    create index(:post_check_ins, [:post_id])
    create index(:post_check_ins, [:user_id])
  end
end
