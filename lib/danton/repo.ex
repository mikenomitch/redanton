defmodule Danton.Repo do
  use Ecto.Repo, otp_app: :danton
  use Scrivener, page_size: 14
end
