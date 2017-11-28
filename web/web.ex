defmodule Danton.Web do
  @moduledoc """
  A module that keeps using definitions for controllers,
  views and so on.

  This can be used in your application as:

      use Danton.Web, :controller
      use Danton.Web, :view

  The definitions below will be executed for every view,
  controller, etc, so keep them short and clean, focused
  on imports, uses and aliases.

  Do NOT define functions inside the quoted expressions
  below.
  """

  def alias_models do
    quote do
      alias Danton.Authorization
      alias Danton.Channel
      alias Danton.ChannelCheckIn
      alias Danton.CheckIn
      alias Danton.Club
      alias Danton.GeneralCheckIn
      alias Danton.Membership
      alias Danton.Message
      alias Danton.Notification
      alias Danton.Post
      alias Danton.PostCheckIn
      alias Danton.Room
      alias Danton.RoomCheckIn
      alias Danton.User
      alias Danton.UserToken
    end
  end

  def model do
    quote do
      use Ecto.Schema

      import Ecto
      import Ecto.Changeset
      import Ecto.Query

      alias Danton.Repo
      alias Ecto.Multi

      use Danton.Web, :alias_models
    end
  end

  def controller do
    quote do
      use Phoenix.Controller
      use Guardian.Phoenix.Controller
      use Danton.Controller.Helpers, :auth
      use Breadcrumble

      alias Danton.Repo
      alias Danton.Plug.EnsureAuthenticated
      alias Danton.Plug.EnsurePermissions

      import Ecto
      import Ecto.Query

      import Danton.Router.Helpers
      import Danton.Controller.Helpers
      import Danton.Gettext

      use Danton.Web, :alias_models
    end
  end

  def view do
    quote do
      use Phoenix.View, root: "web/templates"

      # Import convenience functions from controllers
      import Phoenix.Controller, only: [get_csrf_token: 0, get_flash: 2, view_module: 1]

      # Use all HTML functionality (forms, tags, etc)
      use Phoenix.HTML

      import Danton.View.Helpers
      import Danton.Router.Helpers
      import Danton.ErrorHelpers
      import Danton.Gettext

      use Danton.Web, :alias_models
    end
  end

  def router do
    quote do
      use Phoenix.Router
    end
  end

  def channel do
    quote do
      use Phoenix.Channel

      alias Danton.Repo
      alias Ecto.Multi

      import Ecto
      import Ecto.Query
      import Danton.Gettext

      use Danton.Web, :alias_models
    end
  end

  @doc """
  When used, dispatch to the appropriate controller/view/etc.
  """
  defmacro __using__(which) when is_atom(which) do
    apply(__MODULE__, which, [])
  end
end
