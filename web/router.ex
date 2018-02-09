defmodule Danton.Router do
  use Danton.Web, :router

  # ================
  # ================
  #    PIPELINES
  # ================
  # ================

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :browser_auth do
    plug Danton.AuthPipeline.Browser
  end

  pipeline :admin_browser_auth do
    plug Danton.AuthPipeline.Admin
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :api_auth do
    plug Danton.AuthPipeline.Api
  end

  # ===============
  # ===============
  #      ADMIN
  # ===============
  # ===============

  scope "/admin", Danton.Admin, as: :admin do
    pipe_through [:browser, :browser_auth, :admin_browser_auth]

    resources "/authorizations", AuthorizationController
    resources "/clubs", ClubController
    resources "/memberships", MembershipController
    resources "/messages", MessageController
    resources "/notifications", NotificationController
    resources "/posts", PostController
    resources "/users", UserController
  end

  # ===============
  # ===============
  #       API
  # ===============
  # ===============

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
        resources "/posts", Api.V1.PostController, only: [:index, :create]
        resources "/memberships", Api.V1.MembershipController, only: [:index, :create]

        resources "/tags", Api.V1.TagController, only: [:index]
      end

      resources "/tags", Api.V1.TagController do
        resources "/posts", Api.V1.PostController, only: [:index, :create]
      end

      resources "/posts", Api.V1.PostController do
        get "/users", Api.V1.UserController, :index
        resources "/messages", Api.V1.MessageController, only: [:index, :create]
      end

      get "/users", Api.V1.UserController, :index
      post "/users/create_token", Api.V1.UserController, :create_token
      patch "/users/self", Api.V1.UserController, :update_self
      resources "/messages", Api.V1.MessageController
    end
  end

  scope "/api_auth", Danton do
    pipe_through [:api]

    scope "/v1" do
      post "/login", Api.V1.AuthController, :login
      post "/sign_up", Api.V1.AuthController, :sign_up
    end
  end

  # ================
  # ================
  #     BROWSER
  # ================
  # ================

  scope "/", Danton do
    pipe_through [:browser, :browser_auth]

    get "/", PageController, :index
    get "/about", PageController, :about
    get "/privacy", PageController, :privacy
    get "/licenses", PageController, :licenses
    get "/stream", PostController, :front_page

    get "/no_clubs", PageController, :no_clubs
    get "/no_tags", PageController, :no_tags
    get "/no_posts", PageController, :no_posts

    resources "/clubs", ClubController do
      delete "/leave", ClubController, :leave
      resources "/members", MembershipController, only: [:index, :new, :create, :update, :delete]
      resources "/posts", PostController, only: [:new, :create, :show]
      resources "/memberships", MembershipController, only: [:index, :new, :update, :delete]
      post "/memberships/:id/elevate", MembershipController, :elevate
    end

    resources "/tags", TagController do
      resources "/posts", PostController, only: [:new, :create, :show]
    end
    resources "/posts", PostController
    resources "/messages", MessageController
    resources "/rooms", RoomController

    get "/logout", AuthController, :logout
    delete "/logout", AuthController, :logout

    resources "/users", UserController
    get "/settings", UserController, :settings
    get "/sign_up", UserController, :new
    get "/password_reset", UserController, :password_reset
    post "/send_reset_email", UserController, :send_reset_email
    get "/set_password", UserController, :set_password
    post "/set_new_password", UserController, :set_new_password

    resources "/users", UserController
    resources "/authorizations", AuthorizationController
  end

  scope "/login", Danton do
    pipe_through [:browser]

    get "/", AuthController, :login
    get "/:identity", AuthController, :login
    get "/:identity/callback", AuthController, :callback
    post "/:identity/callback", AuthController, :callback
  end
end
