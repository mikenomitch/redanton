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

alias Danton.Repo

Repo.delete_all Danton.Membership
Repo.delete_all Danton.User
Repo.delete_all Danton.Message
Repo.delete_all Danton.Room
Repo.delete_all Danton.Post
Repo.delete_all Danton.Channel
Repo.delete_all Danton.Club

# ==============
# Make Users
# ==============

users = [
  %Danton.User{name: "Michael Nomitch", email: "mikenomitch@gmail.com", password: "secret", password_confirmation: "secret"},
  %Danton.User{name: "Dan Mihalov", email: "danmihalov@gmail.com", password: "secret", password_confirmation: "secret"}
]

users |> Enum.each(&Repo.insert!/1)

made_users = Repo.all(Danton.User)

# ==============
# Make Clubs
# ==============

clubs = [
	%Danton.Club{name: "Nomitch Fam", description: "link share for the family"},
	%Danton.Club{name: "Brain Food", description: "let's share some interesting stuff"}
]

clubs |> Enum.each(&Repo.insert!/1)
made_clubs = Repo.all(Danton.Club)

# ==============
# Make Memberships
# ==============

make_memberships = fn club ->
	make_membership = fn (user) ->
		Ecto.build_assoc(club, :memberships, %{user_id: user.id, type: "admin"})
	end

	Enum.map(made_users, make_membership)
end

memberships = Enum.flat_map(made_clubs, make_memberships)
memberships |> Enum.each(&Repo.insert!/1)

# ==============
# Make Channels
# ==============

channels = [
	%Danton.Channel{name: "Videos", description: "videos that might be of interest", club_id: 1},
	%Danton.Channel{name: "News", description: "news stories that might be of interest", club_id: 1},
	%Danton.Channel{name: "Tech", description: "any interesting tech or business news", club_id: 1},
	%Danton.Channel{name: "Articles", description: "channel for articles of interest", club_id: 2},
	%Danton.Channel{name: "Music", description: "music that might be of interest", club_id: 2},
	%Danton.Channel{name: "Gear", description: "sharing gear that the other bugs might like", club_id: 2},
]

assoc_channels = fn (chan) ->
	club = Repo.get(Danton.Club. chan.club_id)
	cs = Ecto.build_assoc(club, :channels, chan)
	Repo.insert!(cs)
end

made_chans = Repo.all(Danton.Channel)

# ==============
# Make Posts
# ==============

posts = [
	%Danton.Post{},
	%Danton.Post{}
]

assoc_channels = fn (chan) ->
	club = Repo.get(Danton.Club. chan.club_id)
	cs = Ecto.build_assoc(club, :channels, chan)
	Repo.insert!(cs)
end

# ==============
# Make Rooms
# ==============

# ==============
# Make Message
# ==============
