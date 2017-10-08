defmodule Danton.Email do
  use Bamboo.Phoenix, view: Danton.EmailView

  def new_chat_message(user, params) do
    base_email()
    |> to(email_for_user(user)) # really should be `user.email`
    |> subject("New Chat Message")
    |> assign(:person, user)
    |> render("new_chat_message.html", sender_name: params.sender_name, post_title: params.post_title)
  end

  def new_club_invite(user, _params) do
    base_email()
    |> to(email_for_user(user)) # really should be `user.email`
    |> subject("Invited to Club")
    |> assign(:person, user)
    |> render("new_club_invite.html")
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
    default_email = "mikenomitch+danton@gmail.com"
    acceptable_user_emails = [
      "mikenomitch@gmail.com"
    ]

    on_prod = Application.get_env(:danton, :env) == :prod
    email_is_acceptable = Enum.member?(acceptable_user_emails, user.email)

    if (email_is_acceptable && on_prod) do
      user.email
    else
      default_email
    end
  end
end
