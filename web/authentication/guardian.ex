defmodule Danton.Guardian do
  use Guardian, otp_app: :danton

  alias Danton.Repo
  alias Danton.User

  def subject_for_token(user = %User{}, _claims) do
    IO.puts "I WAS CALLED!"
    { :ok, "User:#{user.id}" }
  end

  def subject_for_token(_, _) do
    IO.puts "WAT!"
    { :error, "Unknown resource type" }
  end

  def resource_from_claims(%{"sub" => "User:" <> uid_str}) do
    user = Repo.get(User, uid_str)
    { :ok, user }
  end

  def resource_from_claims(_) do
    { :error, "Unknown resource type" }
  end
end