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

# passwords are "secret"
users = [
  %Danton.User{name: "Michael Nomitch", email: "mikenomitch@gmail.com", avatar: "https://scontent.ford1-1.fna.fbcdn.net/v/t1.0-1/p240x240/13934743_4154683422348_4358878110125305408_n.jpg?oh=b9479a030c0b081197e9b4a2e91181f7&oe=5A0CC1DB"},
  %Danton.User{name: "Dan Mihalov", email: "danmihalov@gmail.com", avatar: "https://scontent.ford1-1.fna.fbcdn.net/v/t1.0-9/1393772_2712932459475_332693732_n.jpg?oh=c8880860965ae1e28637201cd57cdff2&oe=59FA61FB"}
]

users |> Enum.each(&Repo.insert!/1)

made_users = Repo.all(Danton.User)
first_user = hd made_users

# ==============
# Make Clubs
# ==============

clubs = [
	%Danton.Club{name: "Nomitch Fam", description: "link share for the family"},
	%Danton.Club{name: "Brain Food", description: "let's share some interesting stuff"}
]

clubs |> Enum.each(&Repo.insert!/1)
made_clubs = Repo.all(Danton.Club)
first_club = hd made_clubs

# ==============
# Make Memberships
# ==============

make_memberships = fn club ->
	Enum.map(made_users, &(Danton.Club.make_admin(club, &1)))
end

Enum.each(made_clubs, make_memberships)

# ==============
# Make Channels
# ==============

channels = [
	%Danton.Channel{name: "Videos", description: "videos that might be of interest"},
	%Danton.Channel{name: "News", description: "news stories that might be of interest"},
	%Danton.Channel{name: "Tech", description: "any interesting tech or business news"},
	%Danton.Channel{name: "Articles", description: "channel for articles of interest"},
	%Danton.Channel{name: "Music", description: "music that might be of interest"},
	%Danton.Channel{name: "Gear", description: "sharing gear that the other bugs might like"},
]


make_channels = fn (chan) ->
	club = Repo.get(Danton.Club, first_club.id)
	Danton.Club.make_channel(club, chan)
end

Enum.each(channels, make_channels)

made_chans = Repo.all(Danton.Channel)
first_chan = hd made_chans

# ==============
# Make Posts
# ==============

posts = [
	%Danton.Post{title: "Considerations on Cost Disease", description: "slate star post on costs going up", type: "link", url: "http://slatestarcodex.com/2017/02/09/considerations-on-cost-disease/"},
	%Danton.Post{title: "The End of the Future", description: "Thiel's famous piece on technological stagnation", type: "link", url: "http://www.nationalreview.com/article/278758/end-future-peter-thiel"},
	%Danton.Post{title: "Humans Need Not Apply", description: "Scary stuff related to AI and jobs", type: "link", url: "https://www.youtube.com/watch?v=7Pq-S557XQU"}
]

Enum.each(posts, &(Danton.Channel.make_post_for_user(first_chan, first_user, &1)))
made_posts = Repo.all(Danton.Post)

# ==============
# Make Rooms
# ==============

Enum.each(made_posts, &Danton.Post.make_room/1)
first_room = Repo.get(Danton.Room, 1)

# ==============
# Make Message
# ==============

Danton.Room.make_message(first_room, %{body: "this is the first message"})

# ==============

IO.puts("Done with seeding.")
