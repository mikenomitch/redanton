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
    plug Coherence.Authentication.Session, protected: true  # Add this
  end

  # Add this block
  scope "/" do
    pipe_through :browser
    coherence_routes
  end

  # Add this block
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
    resources "/clubs", ClubController
    resources "/channels", ChannelController do
      resources "/posts", PostController do
        resources "/comments", CommentController
      end
    end
  end


  scope "/", Danton do
    pipe_through :browser # Use the default browser stack

  end

  # pipeline :api do
  #   plug :accepts, ["json"]
  # end

  # Other scopes may use custom stacks.
  # scope "/api", Danton do
  #   pipe_through :api
  # end
end
