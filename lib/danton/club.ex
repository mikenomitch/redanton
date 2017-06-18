defmodule Danton.Club do
  use Ecto.Schema

  schema "clubs" do
    field :name, :string
    field :description, :string
  end
	def changeset(person, params \\ %{}) do
		person
		|> Ecto.Changeset.cast(params, [:name, :descriptopn])
		|> Ecto.Changeset.validate_required([:name])
	end
end