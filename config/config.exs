# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :danton,
  ecto_repos: [Danton.Repo],
  env: Mix.env

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

# TODO: Set up the secret_key properly (see docs)
config :guardian, Guardian,
  allowed_algos: ["HS256"], # optional
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

config :ueberauth, Ueberauth,
  base_path: "/login",
  providers: [
    identity: {
      Ueberauth.Strategy.Identity, [
        callback_methods: ["POST"],
        request_path: "/login"
      ]
		},
		identity: {
      Ueberauth.Strategy.Identity, [
        callback_methods: ["POST"],
        request_path: "/api_login/v1"
      ]
    }
  ]

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
    Danton.ExAdmin.Authorization,
    Danton.ExAdmin.UserToken,
    # Danton.ExAdmin.User,
    Danton.ExAdmin.Room,
    Danton.ExAdmin.Message,
    Danton.ExAdmin.PostCheckIn,
    Danton.ExAdmin.RoomCheckIn,
    Danton.ExAdmin.ChannelCheckIn,
    Danton.ExAdmin.GeneralCheckIn
  ]

config :danton, Danton.Mailer,
  adapter: Bamboo.SendgridAdapter,
  api_key: System.get_env("SENDGRID_API_KEY")

config :xain, :after_callback, {Phoenix.HTML, :raw}

# CONFIGURE JOBS

config :danton, Danton.Scheduler,
jobs: [
  {"* * * * *", {Danton.BatchNotifier, :run, []}}
]