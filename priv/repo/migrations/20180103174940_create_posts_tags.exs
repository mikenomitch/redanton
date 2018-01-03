defmodule Danton.Repo.Migrations.CreatePostsTags do
  use Ecto.Migration

  def change do
    create table(:posts_tags) do
      add :post_id, references(:posts)
      add :tag_id, references(:tags)

      timestamps()
    end
  end
end
