defmodule Danton.Repo.Migrations.SetDefaultActivityAt do
  use Ecto.Migration

  # very inefficient, but fine at our scale
  def up do
    all_posts_with_messages = Danton.Post.with_messages() |> Danton.Repo.all()

    Enum.each(
      all_posts_with_messages,
      fn (p) ->
        message = Danton.Message.latest_for_post(p)
        time = message && message.inserted_at || p.inserted_at
        Danton.Post.changeset(p, %{activity_at: time}) |> Danton.Repo.update
      end
    )
  end

  def down do
  end
end
