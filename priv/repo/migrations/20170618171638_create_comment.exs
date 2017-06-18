defmodule Danton.Repo.Migrations.CreateComment do
  use Ecto.Migration

  def change do
    create table(:comments) do
      add :body, :text
      add :parent_type, :string
      add :comment_id, references(:comments, on_delete: :nothing)
      add :post_id, references(:posts, on_delete: :nothing)
      add :user_id, references(:users, on_delete: :nothing)

      timestamps()
    end
    create index(:comments, [:comment_id])
    create index(:comments, [:post_id])
    create index(:comments, [:user_id])

  end
end
