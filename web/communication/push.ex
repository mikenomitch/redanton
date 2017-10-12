alias Danton.NotificationPusher

defmodule Danton.Push do
  def new_chat_message(token, params) do
    "message from #{params.sender_name} in #{params.post_title}"
    |> make_message(token)
    |> NotificationPusher.publish_message()
  end

  def new_club_invite(token, params) do
    "you have been invited to #{params.club_name}"
    |> make_message(token)
    |> NotificationPusher.publish_message()
  end

  def new_post(token, params) do
    "new post: #{params.post_title}"
    |> make_message(token)
    |> NotificationPusher.publish_message()
  end

  defp make_message(body, token, opts \\ %{}) do
    base = %{
      "to" => token,
      "sound" => "default",
      "body" => body
    }

    Map.merge(base, opts)
  end
end
