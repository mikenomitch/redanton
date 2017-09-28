defmodule Danton.Email do
  use Bamboo.Phoenix, view: Danton.EmailView

  def new_chat_message(user, _params) do
    base_email()
    |> to("mikenomitch@gmail.com") # really should be `user.email`
    |> subject("New Chat Message")
    |> assign(:person, user)
    |> render("new_chat_message.html")
  end

  def new_club_invite(user, _params) do
    base_email()
    |> to("mikenomitch@gmail.com") # really should be `user.email`
    |> subject("Invited to Club")
    |> assign(:person, user)
    |> render("new_club_invite.html")
  end

  def test_message(person) do
    base_email()
    |> to(person)
    |> subject("This is a Test")
    |> assign(:person, person)
    |> render("test_message.html")
  end

  defp base_email do
    new_email()
    |> from("Mike Nomitch<mikenomitch@gmail.com>")
    |> put_header("Reply-To", "mikenomitch@gmail.com")
    # This will use the "email.html.eex" file as a layout when rendering html emails.
    # Plain text emails will not use a layout unless you use `put_text_layout`
    |> put_html_layout({Danton.LayoutView, "email.html"})
  end
end
