defmodule Danton.AuthAccessPipeline do
  # @claims %{typ: "access"}

  use Guardian.Plug.Pipeline,
    otp_app: :danton,
    module: Danton.Guardian,
    error_handler: Danton.AuthErrorHandler

  plug Guardian.Plug.VerifySession
  plug Guardian.Plug.VerifyCookie
  plug Guardian.Plug.LoadResource, ensure: true, allow_blank: true
end
