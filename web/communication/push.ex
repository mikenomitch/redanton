alias Danton.NotificationPusher

defmodule Danton.Push do
  def new_chat_message(token, params) do
    "message from #{params[:sender_name]} in #{params[:post_title]}"
    |> make_message(token)
    |> NotificationPusher.publish_message()
  end

  def new_club_invite(token, params) do
    "you have been invited to #{params[:club_name]}"
    |> make_message(token)
    |> NotificationPusher.publish_message()
  end

  def new_post(token, params) do
    "new post: #{params[:post_title]}"
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
      new_posts_str(p) <> " and " <> new_messages_str(m)
    else
      if (m > 0), do: new_messages_str(m), else: new_posts_str(p)
    end
  end

  defp new_messages_str(m) do
    if m == 1, do: "1 new message", else: "#{m} new messages"
  end

  defp new_posts_str(p) do
    if p == 1, do: "1 new post", else: "#{p} new posts"
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
