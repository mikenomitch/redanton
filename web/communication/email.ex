defmodule Danton.Email do
  use Bamboo.Phoenix, view: Danton.EmailView
  @app_path "exp://exp.host/@mikenomitch/danton"
  @base_site_url "http://www.relayd.io"

  def new_chat_message(user, params) do
    base_email()
    |> to(email_for_user(user)) # really should be `user.email`
    |> subject("New Chat Message")
    |> assign(:person, user)
    |> render(
      "new_chat_message.html",
      sender_name: params.sender_name,
      post_title: params.post_title,
      post_path: @base_site_url <> params.post_path,
      app_path: @app_path
    )
  end

  def new_club_invite(user, params) do
    base_email()
    |> to(email_for_user(user)) # really should be `user.email`
    |> subject("Invited to Club")
    |> assign(:person, user)
    |> render(
      "new_club_invite.html",
      club_name: params.club_name,
      site_url: @base_site_url,
      app_path: @app_path
    )
  end

  def new_post(user, params) do
    base_email()
    |> to(email_for_user(user)) # really should be `user.email`
    |> subject("New Post")
    |> assign(:person, user)
    |> render(
      "new_post.html",
      poster_name: params.poster_name,
      post_title: params.post_title,
      post_path: params.post_path,
      app_path: @app_path
    )
  end

  def password_reset(user, %{token: token}) do
    base_email()
    |> to(email_for_user(user)) # really should be `user.email`
    |> subject("Password Reset")
    |> assign(:person, user)
    |> render(
      "password_reset.html",
      password_link: @base_site_url <> "/set_password?token=" <> token,
      app_path: @app_path
    )
  end

  defp base_email do
    new_email()
    |> from("Mike Nomitch<mikenomitch@gmail.com>")
    |> put_header("Reply-To", "mikenomitch@gmail.com")
    # This will use the "email.html.eex" file as a layout when rendering html emails.
    # Plain text emails will not use a layout unless you use `put_text_layout`
    |> put_html_layout({Danton.LayoutView, "email.html"})
  end

  defp email_for_user(user) do
    dev_email = "mikenomitch+danton@gmail.com"
    on_prod = Application.get_env(:danton, :env) == :prod

    if (on_prod) do
      user.email
    else
      dev_email
    end
  end
end
