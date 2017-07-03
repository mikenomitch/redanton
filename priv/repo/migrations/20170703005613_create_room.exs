defmodule Danton.Repo.Migrations.CreateRoom do
  use Ecto.Migration

  def change do
    create table(:rooms) do
      add :post_id, references(:posts, on_delete: :nothing)

      timestamps()
    end
    create index(:rooms, [:post_id])

  end
end
