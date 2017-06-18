defmodule Danton.Repo.Migrations.CreateClub do
  use Ecto.Migration

  def change do
    create table(:clubs) do
      add :name, :string
      add :description, :string

      timestamps()
    end

  end
end
