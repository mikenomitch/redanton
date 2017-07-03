# =============================
# getting a model from id
# =============================

# message = Repo.get(Message, 13)

# =============================
# querying by params
# =============================

# import Ecto.Query, only: [from: 2]
# query = from u in User, where: u.age > 18 or is_nil(u.email), select: u
# list_of_users = Repo.all(query)

# =============================
# updating a model
# =============================

# Post.changeset(post, %{title: "some new title"}) |> Repo.insert

# =============================
# getting an association list
# =============================

# Repo.all Ecto.assoc(membership, :user)

# =============================
# creating an association
# =============================

# room = Repo.get(Room, 13)
# message = build_assoc(post, :messages)
# or
# message = build_assoc(post, :messages, title: "hey")

