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

# TODO: Set up the secret_key properly (see docs)
config :guardian, Guardian,
  allowed_algos: ["HS512"], # optional
  verify_module: Guardian.JWT,  # optional
  issuer: "Danton",
  ttl: { 30, :days },
  allowed_drift: 2000,
  verify_issuer: true, # optional
  secret_key: %{
    "k" => "XxSBVJfYyNiEJviIhSv2-jGNXcuZj8yHHg3CypsYD0Xe0WfcA1J1e9vlxo2isc0CmGLAeT_88ut6TGQGTGw2rw",
    "kty" => "oct"
  }, # TODO: replace this with something real
  serializer: Danton.GuardianSerializer

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
    Danton.ExAdmin.Membership,
    Danton.ExAdmin.User,
    Danton.ExAdmin.Room,
    Danton.ExAdmin.Message
  ]

config :xain, :after_callback, {Phoenix.HTML, :raw}

