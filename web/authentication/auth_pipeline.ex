defmodule Danton.AuthAccessPipeline do
  @claims %{typ: "access"}

  use Guardian.Plug.Pipeline, otp_app: :danton,
                              module: Danton.Guardian,
                              error_handler: Danton.AuthErrorHandler

  plug Guardian.Plug.VerifySession

  # move these back in?

  # plug Guardian.Plug.VerifyHeader, claims: @claims, realm: "Bearer"
  # plug Guardian.Plug.EnsureAuthenticated
  plug Guardian.Plug.LoadResource
end
