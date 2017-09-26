defmodule Danton.Router do
  use Danton.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  # This plug will look for a Guardian token in the session in the default location
  # Then it will attempt to load the resource found in the JWT.
  # If it doesn't find a JWT in the default location it doesn't do anything
  pipeline :browser_auth do
    plug Guardian.Plug.VerifySession
    plug Guardian.Plug.LoadResource
  end

  # This pipeline is created for use within the admin namespace.
  # It looks for a valid token in the session - but in the 'admin' location of guardian
  # This keeps the session credentials seperate for the main site, and the admin site
  # It's very possible that a user is logged into the main site but not the admin
  # or it could be that you're logged into both.
  # This does not conflict with the browser_auth pipeline.
  # If it doesn't find a JWT in the location it doesn't do anything
  pipeline :admin_browser_auth do
    plug Guardian.Plug.VerifySession, key: :admin
    plug Guardian.Plug.LoadResource, key: :admin
  end

  # We need this pipeline to load the token when we're impersonating.
  # We don't want to load the resource though, just verify the token
  pipeline :impersonation_browser_auth do
    plug Guardian.Plug.VerifySession, key: :admin
  end

  scope "/" do
    pipe_through :browser
  end

  use ExAdmin.Router
  # your app's routes
  scope "/admin", ExAdmin do
    pipe_through :browser
    admin_routes()
  end

  # PRIVATE ROUTES
  scope "/", Danton do
    pipe_through :browser
    get "/", PageController, :index
  end

  # PROTECTED ROUTES
  scope "/", Danton do
    pipe_through [:browser, :browser_auth, :impersonation_browser_auth]

    get "/front", PostController, :front_page

    # Add public routes below
    resources "/memberships", MembershipController

    resources "/clubs", ClubController do
      resources "/channels", ChannelController, only: [:index, :new, :create]
    end

    resources "/channels", ChannelController do
      resources "/posts", PostController, only: [:index, :new, :create]
    end

    resources "/posts", PostController do
      resources "/messages", MessageController, only: [:index, :new, :create]
    end

    resources "/messages", MessageController
    resources "/rooms", RoomController

    # TODO: replace this with a view
    get "/logout", AuthController, :logout
    delete "/logout", AuthController, :logout
    resources "/users", UserController
    resources "/authorizations", AuthorizationController
  end

  # This scope is the main authentication area for Ueberauth
  scope "/login", Danton do
    pipe_through [:browser, :browser_auth] # Use the default browser stack

    get "/", AuthController, :login
    get "/:identity", AuthController, :login
    get "/:identity/callback", AuthController, :callback
    post "/:identity/callback", AuthController, :callback
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  # This pipeline if intended for API requests and looks for the JWT in the "Authorization" header
  # In this case, it should be prefixed with "Bearer" so that it's looking for
  # Authorization: Bearer <jwt>
  pipeline :api_auth do
    plug Guardian.Plug.VerifyHeader, realm: "Bearer"
    plug Guardian.Plug.LoadResource
    plug Guardian.Plug.EnsureAuthenticated, handler: Danton.Controller.APIHelper, typ: "access"
  end

  # Other scopes may use custom stacks.
  scope "/api", Danton do
    pipe_through [:api, :api_auth]

    # TODO: recomment this once the mobile app handles users

    scope "/v1" do
      get "/front", Api.V1.PostController, :front_page
      resources "/memberships", Api.V1.MembershipController

      resources "/clubs", Api.V1.ClubController do
        delete "/leave", Api.V1.ClubController, :leave
        get "/users", Api.V1.UserController, :index
        get "/memberships", Api.V1.MembershipController, :index
        resources "/channels", Api.V1.ChannelController, only: [:index, :new, :create]
      end

			resources "/channels", Api.V1.ChannelController do
        resources "/posts", Api.V1.PostController, only: [:index, :new, :create]
      end

      resources "/posts", Api.V1.PostController do
        get "/users", Api.V1.UserController, :index
        resources "/messages", Api.V1.MessageController, only: [:index, :new, :create]
      end

      get "/users", Api.V1.UserController, :index
      resources "/messages", Api.V1.MessageController
    end
  end

  # pipeline :api_login do
  #   plug Guardian.Plug.LoadResource
  # end

  scope "/api_login", Danton do
    pipe_through [:api]

    scope "/v1" do
      post "/", Api.V1.AuthController, :login
    end
  end
end
