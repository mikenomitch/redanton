defmodule Danton.Router do
  use Danton.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  scope "/", Danton do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index
    resources "/channels", ChannelController do
      resources "/posts", PostController do
        resources "/comments", CommentController
      end
    end
  end

  # pipeline :api do
  #   plug :accepts, ["json"]
  # end

  # Other scopes may use custom stacks.
  # scope "/api", Danton do
  #   pipe_through :api
  # end
end
