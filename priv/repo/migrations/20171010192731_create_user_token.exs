defmodule Danton.Repo.Migrations.CreateUserToken do
  use Ecto.Migration

  def change do
    create table(:user_tokens) do
      add :type, :string
      add :value, :string
      add :status, :string
      add :user_id, references(:users, on_delete: :nothing)

      timestamps()
    end

    create index(:user_tokens, [:user_id])
  end
end
