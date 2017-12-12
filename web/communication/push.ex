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

  def batch_notification(token, params) do
    batch_message(params)
    |> make_message(token)
    |> NotificationPusher.publish_message()
  end

  defp batch_message(%{messages_waiting: m, posts_waiting: p}) do
    if (m > 0 && p > 0) do
      "#{p} new posts and #{m} new messages."
    else
      if (m > 0) do
        "#{m} new messages."
      else
        "#{p} new posts."
      end
    end
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
