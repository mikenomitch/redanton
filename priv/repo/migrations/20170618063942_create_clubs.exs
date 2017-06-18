defmodule Danton.Repo.Migrations.CreateClubs do
  use Ecto.Migration

  def change do
    create table(:clubs) do
      add :name, :string
      add :description, :text
    end
  end
end
