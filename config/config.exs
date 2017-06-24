# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :danton,
  ecto_repos: [Danton.Repo]

# Configures the endpoint
config :danton, Danton.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "Wz/r6VWueC0MVJxhWwAh/VhJY6uxsZYRJnIhYtGYXXheTtumCoDPFNkkUw72SxJZ",
  render_errors: [view: Danton.ErrorView, accepts: ~w(html json)],
  modules: [
    Danton.ExAdmin.Dashboard,
  ],
  pubsub: [name: Danton.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"

# %% Coherence Configuration %%   Don't remove this line
config :coherence,
  user_schema: Danton.User,
  repo: Danton.Repo,
  module: Danton,
  logged_out_url: "/",
  email_from_name: "Your Name",
  email_from_email: "yourname@example.com",
  opts: [:authenticatable, :recoverable, :lockable, :trackable, :unlockable_with_token, :invitable, :registerable]

config :coherence, Danton.Coherence.Mailer,
  adapter: Swoosh.Adapters.Sendgrid,
  api_key: "your api key here"
# %% End Coherence Configuration %%

# Configure Ex Admin
config :ex_admin,
  repo: Danton.Repo,
  module: Danton,
  modules: [
    Danton.ExAdmin.Dashboard,
    Danton.ExAdmin.Club,
    Danton.ExAdmin.Channel,
    Danton.ExAdmin.Post,
    Danton.ExAdmin.Comment,
    Danton.ExAdmin.Membership,
    Danton.ExAdmin.User
  ]

config :xain, :after_callback, {Phoenix.HTML, :raw}

