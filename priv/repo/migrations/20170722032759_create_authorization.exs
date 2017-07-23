defmodule Danton.Repo.Migrations.CreateAuthorization do
  use Ecto.Migration

  def change do
    create table(:authorization) do
      add :provider, :string
      add :uid, :string
      add :user_id, references(:users, on_delete: :delete_all)
      add :token, :string
      add :refresh_token, :string
      add :expires_at, :bigint

      timestamps
    end

    create index(:authorization, [:provider, :uid], unique: true)
    create index(:authorization, [:expires_at])
    create index(:authorization, [:provider, :token])
  end
end
