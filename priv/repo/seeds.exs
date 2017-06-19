# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Danton.Repo.insert!(%Danton.SomeModel{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

Danton.Repo.delete_all Danton.User
Danton.User.changeset(%Danton.User{}, %{name: "Test User", email: "testuser@example.com", password: "secret", password_confirmation: "secret"})
|> Danton.Repo.insert!

Danton.Repo.delete_all Danton.Comment
Danton.Repo.delete_all Danton.Post
Danton.Repo.delete_all Danton.Channel
Danton.Repo.delete_all Danton.Club


# Make Clubs (2)

clubs = [
	%{name: "Nomitch Fam", description: "link share for the family"},
	%{name: "Brain Food", description: "let's share some interesting stuff"}
]

clubs = Enum.map(clubs, fn(club) -> Danton.Club.changeset(%Danton.Club{}, club) |> Danton.Repo.insert! end)

# Make Channels

# last_club = Danton.Club |> Ecto.Query.last

channels = [
	%{name: "Articles", description: "channel for articles of interest", club_id: 1},
	%{name: "Videos", description: "videos that might be of interest", club_id: 1},
	%{name: "Music", description: "music that might be of interest", club_id: 1},
	%{name: "News", description: "news stories that might be of interest", club_id: 1},
]

Enum.map(channels, fn(chan) -> Danton.Channel.changeset(%Danton.Channel{}, chan) |> Danton.Repo.insert! end)

# Make Posts (2 per channel)

# Make Comments
