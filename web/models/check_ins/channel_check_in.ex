defmodule Danton.ChannelCheckIn do
  use Danton.Web, :model

  alias Danton.Channel
  alias Danton.User

  # ===========================
  # ECTO CONFIG
  # ===========================

  schema "channel_check_ins" do
    has_one :user, User
    has_one :channel, Channel

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [])
  end
end
