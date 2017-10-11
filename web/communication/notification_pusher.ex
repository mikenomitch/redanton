defmodule Danton.NotificationPusher do
  @push_url "https://exp.host/--/api/v2/push/send"

  def publish_messages(messages) do
    params = Poison.encode!(messages)
    headers = [
      {"Content-Type", "application/json"},
      {"Accept", "application/json"},
      {"Accept-Encofing", "gzip, deflate"}
    ]
    HTTPoison.post(@push_url, params, headers)
  end

  def publish_message(message) do
    publish_messages([message])
  end

  def is_push_token?(token) do
    String.starts_with?(token, "ExponentPushToken")
  end
end
