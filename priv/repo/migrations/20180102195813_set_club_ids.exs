defmodule Danton.Repo.Migrations.SetClubIds do
  use Ecto.Migration

  # inefficient, but fine at our scale
  def up do
    all_clubs =  Danton.Repo.all(Danton.Club)

    Enum.each(
      all_clubs,
      fn (c) ->
        Danton.Repo.update_all(
          Danton.Post.for_club(c),
          set: [club_id: c.id]
        )
      end
    )
  end

  def down do
  end
end
