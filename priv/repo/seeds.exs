# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
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
  %Danton.User{name: "Mike", email: "mikenomitch@gmail.com", avatar: "https://scontent.ford1-1.fna.fbcdn.net/v/t1.0-1/p240x240/13934743_4154683422348_4358878110125305408_n.jpg?oh=b9479a030c0b081197e9b4a2e91181f7&oe=5A0CC1DB"},
  %Danton.User{name: "Dan", email: "danmihalov@gmail.com", avatar: "https://scontent.ford1-1.fna.fbcdn.net/v/t1.0-9/1393772_2712932459475_332693732_n.jpg?oh=c8880860965ae1e28637201cd57cdff2&oe=59FA61FB"},
  %Danton.User{name: "Steven", email: "stevenan7@gmail.com", avatar: "https://media.licdn.com/mpr/mpr/shrinknp_200_200/p/4/005/0b5/026/15086de.jpg"},
  %Danton.User{name: "Zach", email: "zfertig@gmail.com", avatar: "https://pbs.twimg.com/profile_images/556526218989027328/ERy-0VYQ.jpeg"},
  %Danton.User{name: "Kevin", email: "kevinzussman@gmail.com", avatar: "https://media.licdn.com/mpr/mpr/shrinknp_200_200/AAEAAQAAAAAAAAfOAAAAJDJiYTQwM2NhLWZlNjgtNDI2NS1hYTRjLTBkMzBmNjA3MTQxNg.jpg"},
]

users |> Enum.each(&Repo.insert!/1)

made_users = Repo.all(Danton.User)
first_user = hd made_users

# ==============
# Make Clubs
# ==============

auth_from_user = fn user ->
	%Danton.Authorization{uid: user.email, provider: "identity", token: "$2b$12$bDyyBttsoYbkQSKMcoryeOtVilqpcFE2WDXsf2.s7lLFwLUoM6BpO", user_id: user.id}
end

# passwords are "222222222"
Enum.map(made_users, auth_from_user) |> Enum.each(&Repo.insert!/1)

# ==============
# Make Clubs
# ==============

clubs = [
	%Danton.Club{name: "Brain Food", description: "let's share interesting stuff"}
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
	%Danton.Channel{name: "Articles", description: "Good articles, opinion pieces, blog posts, etc"},
	%Danton.Channel{name: "Sites", description:  "Interesting/Cool sites"},
	%Danton.Channel{name: "Gear", description:  "Gear - clothing, gadgets, etc"},
  %Danton.Channel{name: "Videos", description:  "Videos or Gifs of any sort"},
	%Danton.Channel{name: "Books", description: "Book recs"},
	%Danton.Channel{name: "Music & Movies", description:  "Good albums, singles, bands, etc"},
  %Danton.Channel{name: "Misc", description:  "Things that don't fall into another category but are worth sharing."}
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
	%Danton.Post{title: "The End of the Future", description: "Thiel's famous piece on technological stagnation", type: "link", url: "http://www.nationalreview.com/article/278758/end-future-peter-thiel"}
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

Danton.Room.make_message(first_room, %{body: "Thought this was pretty interesting", user_id: first_user.id})

# ==============

IO.puts("Done with seeding.")
