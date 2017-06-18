defmodule Danton.Router do
  use Danton.Web, :router
  use Coherence.Router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug Coherence.Authentication.Session
  end

  pipeline :protected do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug Coherence.Authentication.Session, protected: true
  end

  # Added by Coherence
  scope "/" do
    pipe_through :browser
    coherence_routes()
  end

  # Added by Coherence
  scope "/" do
    pipe_through :protected
    coherence_routes :protected
  end

  # PRIVATE ROUTES
  scope "/", Danton do
    pipe_through :browser
    get "/", PageController, :index
    # Add public routes below
  end

  # PROTECTED ROUTES
  scope "/", Danton do
    pipe_through :protected
    get "/", PageController, :index

    resources "/clubs", ClubController do
      resources "/channels", ChannelController, only: [:index, :new]
    end

    resources "/channels", ChannelController do
      resources "/posts", PostController, only: [:index, :new]
    end

    resources "/posts", PostController do
      resources "/comments", CommentController, only: [:index, :new]
    end

    resources "/comments", CommentController
  end

  # pipeline :api do
  #   plug :accepts, ["json"]
  # end

  # Other scopes may use custom stacks.
  # scope "/api", Danton do
  #   pipe_through :api
  # end
end
