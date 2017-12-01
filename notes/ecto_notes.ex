# =============================
# getting a model from id
# =============================

# message = Repo.get(Message, 13)

# =============================
# querying multiple by params
# =============================

# import Ecto.Query, only: [from: 2]
# query = from u in User, where: u.age > 18 or is_nil(u.email), select: u
# list_of_users = Repo.all(query)

# =============================
# querying multiple by params
# =============================

# Danton.User |> Repo.get_by(first_name: "Ryan")


# =============================
# querying by relatopnship
# =============================

# Danton.User |> Repo.get_by(first_name: "Ryan")

# =============================
# updating a model
# =============================

# Post.changeset(post, %{title: "some new title"}) |> Repo.update

# =============================
# getting an association
# =============================

# a list
# Repo.all Ecto.assoc(membership, :user)

# a single record
# Repo.one Ecto.assoc(auth, :user)

# =============================
# creating an association
# =============================

# room = Repo.get(Room, 13)
# message = build_assoc(post, :messages)
# or
# message = build_assoc(post, :messages, title: "hey")

