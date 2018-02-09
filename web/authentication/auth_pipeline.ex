defmodule Danton.AuthPipeline.Browser do
  # @claims %{typ: "access"}

  use Guardian.Plug.Pipeline,
    otp_app: :danton,
    module: Danton.Guardian,
    error_handler: Danton.AuthErrorHandler

  plug Guardian.Plug.VerifySession
  plug Guardian.Plug.VerifyCookie
  plug Guardian.Plug.LoadResource, ensure: true, allow_blank: true
end

# This pipeline if intended for API requests and looks for the JWT in the "Authorization" header
# In this case, it should be prefixed with "Bearer" so that it's looking for
# Authorization: Bearer <jwt>
defmodule Danton.AuthPipeline.Api do
  # @claims %{typ: "access"}

  use Guardian.Plug.Pipeline,
    otp_app: :danton,
    module: Danton.Guardian,
    error_handler: Danton.AuthErrorHandler

  plug Guardian.Plug.VerifyHeader, realm: "Bearer"
  plug Guardian.Plug.LoadResource, ensure: true, allow_blank: true
end

defmodule Danton.AuthPipeline.Admin do
  use Guardian.Plug.Pipeline,
    otp_app: :danton,
    module: Danton.Guardian,
    error_handler: Danton.AuthErrorHandler

  plug Guardian.Plug.VerifySession, key: :admin
  plug Guardian.Plug.LoadResource, ensure: true, allow_blank: false
end
