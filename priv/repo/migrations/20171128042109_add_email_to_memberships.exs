defmodule Danton.Repo.Migrations.AddEmailToMemberships do
  use Ecto.Migration

  def up do
    alter table(:memberships) do
      add :email, :string
    end
  end

  def down do
    alter table(:memberships) do
      remove :email
    end
  end
end
