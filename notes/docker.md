<!-- go here for into https://blog.codeship.com/running-your-phoenix-tests-using-docker/ -->

<!-- after a build run the following to get it runnnig -->
docker-compose exec web mix ecto.create
docker-compose exec web mix ecto.migrate
docker-compose exec web mix run priv/repo/seeds.exs