defmodule Danton.PostController do
  use Danton.Web, :controller
  use Danton.CheckIn, :controller
  use Danton.Controller.Helpers, :no_items_rendering

  plug Danton.WebAuthorization, [:post, :view] when action in [:show]
  plug Danton.WebAuthorization, [:post, :edit] when action in [:edit, :update, :delete]

  plug :check_in, :front_page when action in [:front_page]
  plug :check_in, :post when action in [:show]

  plug Guardian.Plug.EnsureAuthenticated, handler: __MODULE__, typ: "access"

  # ===========================
  # ACTIONS
  # ===========================

  # FRONT PAGE

  def front_page(conn, params, current_user, _claims) do
    case index_template(current_user) do
      :no_clubs -> render_no_clubs(conn)
      :no_channels -> render_no_channels(conn)
      :no_posts -> render_no_posts(conn)
      :main -> render_front(conn, params, current_user)
    end
  end

  def index(conn, _params, _current_user, _claims) do
    redirect(conn, to: post_path(conn, :front_page))
  end

  defp render_front(conn, params, current_user) do
    page = Post.for_front_page(current_user) |> Repo.paginate(params)
    posts = page.entries |> Post.with_stream_preloads()

    render(conn,
      "front_page.html",
      posts: posts,
      page_number: page.page_number,
      page_size: page.page_size,
      total_pages: page.total_pages,
      total_entries: page.total_entries
    )
  end

  # ===== END FRONT PAGE

  def new(conn, %{"channel_id" => channel_id}, _current_user, _claims) do
    changeset = Post.changeset(%Post{})

    conn
    |> add_new_post_crumb(channel_id)
    |> render("new.html", changeset: changeset, channel_id: channel_id, channels: :none, clubs: :none)
  end

  def new(conn, _params, current_user, _claims) do
    changeset = Post.changeset(%Post{})
    channels = Channel.for_user(current_user) |> Repo.all()
    clubs = Club.for_user(current_user) |> Repo.all()

    conn
    |> add_new_post_crumb(:front)
    |> render("new.html", changeset: changeset, channel_id: :none, channels: channels, clubs: clubs)
  end

  def create(conn, %{"post" => post_params, "channel_id" => channel_id}, current_user, _claims) do
    create_and_respond(conn, %{"post" => post_params, "channel_id" => channel_id}, current_user)
  end

  def create(conn, %{"post" => post_params}, current_user, _claims) do
    channel_id = post_params["channel_id"]
    create_and_respond(conn, %{"post" => post_params, "channel_id" => channel_id}, current_user)
  end

  defp create_and_respond(conn, %{"post" => post_params, "channel_id" => ""}, current_user) do
    cs = Post.changeset(%Post{}, post_params)
    render_create_error(conn, current_user, cs, :none, "You must add a channel.")
  end

  defp create_and_respond(conn, %{"post" => post_params, "channel_id" => channel_id}, current_user) do
    channel = Repo.get(Channel, channel_id)
    case Post.create_for_channel_and_user(channel, current_user, post_params) do
      {:ok, _post} ->
        conn
        |> put_flash(:info, "Post created successfully.")
        |> redirect(to: channel_path(conn, :show, channel_id))
      {:error, changeset} ->
        render_create_error(conn, current_user, changeset, channel_id)
    end
  end

  defp render_create_error(conn, current_user, cs, channel_id, message \\ "There was an issue creating the post.") do
    channels = Channel.for_user(current_user) |> Repo.all()
    clubs = Club.for_user(current_user) |> Repo.all()

    conn
    |> add_channel_crumb(channel_id)
    |> add_new_post_crumb(:front)
    |> put_flash(:error, message)
    |> render("new.html", changeset: cs, channel_id: channel_id, channels: channels, clubs: clubs)
  end

  def show(conn, %{"id" => id}, current_user, _claims) do
    # TODO: make sure posts have rooms
    post = Repo.get!(Post, id)
      |> Repo.preload(:room)
      |> Post.load_messages()
      |> Repo.preload(:user)
      |> Repo.preload(:channel)

    # TODO: get the actual messages for the room
    messages = Message.for_post(post.id)
      |> Message.ordered_by_earliest()
      |> Repo.all()
      |> Repo.preload(:user)

    conn
    |> add_parent_crumbs(post)
    |> add_post_crumb(post)
    |> render(
      "show.html",
      post: post,
      room_id: post.room && post.room.id,
      messages: messages,
      user_id: current_user.id
    )
  end

  def edit(conn, %{"id" => id}, _current_user, _claims) do
    post = Repo.get!(Post, id)
    changeset = Post.changeset(post)

    conn
    |> add_parent_crumbs(post)
    |> add_post_and_edit_crumbs(post)
    |> render("edit.html", post: post, changeset: changeset, channel_id: post.channel_id)
  end

  def update(conn, %{"id" => id, "post" => post_params}, _current_user, _claims) do
    post = Repo.get!(Post, id)
    changeset = Post.changeset(post, post_params)

    case Repo.update(changeset) do
      {:ok, post} ->
        conn
        |> put_flash(:info, "Post updated successfully.")
        |> redirect(to: post_path(conn, :show, post))
      {:error, changeset} ->
        conn
        |> add_parent_crumbs(post)
        |> add_post_and_edit_crumbs(post)
        |> render("edit.html", post: post, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}, _current_user, _claims) do
    Post.destroy(id)
    conn
    |> put_flash(:info, "Post deleted successfully.")
    |> redirect(to: post_path(conn, :front_page))
  end

  # BREADCRUMBS

  defp add_parent_crumbs(conn, post) do
    channel_id = post.channel_id
    channel = Repo.get(Channel, channel_id)

    conn
      |> add_club_crumb(channel.club_id)
      |> add_channel_crumb(channel_id)
  end

  defp add_club_crumb(conn, club_id) do
    club = Repo.get(Club, club_id)
    conn
    |> add_breadcrumb(name: "Clubs", url: "/clubs")
    |> add_breadcrumb(name: club.name, url: "/clubs/#{inspect(club_id)}")
  end

  defp add_channel_crumb(conn, :none), do: conn

  defp add_channel_crumb(conn, channel_id) do
    channel = Repo.get(Channel, channel_id)

    conn
    |> add_breadcrumb(name: "Channels", url: "/channels")
    |> add_breadcrumb(name: channel.name, url: "/channels/#{inspect(channel_id)}")
  end

  defp add_new_post_crumb(conn, channel) do
    case channel do
      :front ->
        conn
        |> add_breadcrumb(name: "My Stream", url: "/front")
        |> add_breadcrumb(name: "New Post", url: "/posts/new")
      channel_id ->
        conn
        |> add_channel_crumb(String.to_integer(channel_id)) # this is pretty gross (the interpolation issues)
        |> add_breadcrumb(name: "New Post", url: "/channels/#{inspect(channel_id)}/posts/new")
    end
  end

  defp add_post_and_edit_crumbs(conn, post) do
    conn
    |> add_post_crumb(post)
    |> add_edit_post_crumb(post)
  end

  defp add_post_crumb(conn, post) do
    add_breadcrumb(conn, name: post.title, url: "/posts/#{inspect(post.id)}")
  end

  defp add_edit_post_crumb(conn, post) do
    add_breadcrumb(conn, name: "Edit", url: "/posts/#{inspect(post.id)}/edit")
  end
end
