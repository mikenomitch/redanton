alias Danton.NotificationPusher

defmodule Danton.Push do
  def new_chat_message(token, params) do
    make_message(token, "message from #{params.sender_name} in #{params.post_title}") |> NotificationPusher.publish_message
  end

  def new_club_invite(token, params) do
    make_message(token, "you have been invited to #{params.club_name}") |> NotificationPusher.publish_message
  end

  def new_post(token, params) do
    make_message(token, "new post: #{params.post_title}") |> NotificationPusher.publish_message
  end

  defp make_message(token, body, opts \\ %{}) do
    base = %{
      "to" => token,
      "sound" => "default",
      "body" => body
    }

    Map.merge(base, opts)
  end
end
