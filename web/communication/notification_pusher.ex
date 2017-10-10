defmodule Danton.NotificationPusher do
  @push_url "https://exp.host/--/api/v2/push/send"

  def publish(messages) do
    params = Poison.encode!(messages)
    headers = [{"Content-Type", "application/json"}, {"Accept", "application/json"}, {"Accept-Encofing", "gzip, deflate"}]

    case HTTPoison.post(@push_url, params, headers) do
      res ->
        IO.puts inspect(res)
      # {:ok, %HTTPoison.Response{status_code: 200, body: body}} ->
      #   IO.puts body
      # {:ok, %HTTPoison.Response{status_code: 404}} ->
      #   IO.puts "Not found :("
      # {:error, %HTTPoison.Error{reason: reason}} ->
      #   IO.inspect reason
    end
  end

  def publish_message(message) do
    publish [message]
  end

  def is_push_token?(token) do
    String.starts_with?(token, "ExponentPushToken")
  end

  def test() do
    [
      %{
        "to" => "ExponentPushToken[eYNmx8OqGV1ilFXI1JW_T9]",
        "sound" => "default",
        "body" => "Good work!"
      }
    ] |> publish
  end
end
