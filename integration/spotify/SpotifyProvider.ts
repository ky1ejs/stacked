import { IntegrationProviderId } from "@prisma/client";
import IntegrationProvider, {
  AuthCallbackHandler,
} from "../IntegrationProvider";

const handleAuthCallback: AuthCallbackHandler = async (code, provider) => {
  const formParams = new URLSearchParams();
  formParams.append("grant_type", "authorization_code");
  formParams.append("code", code);
  formParams.append("client_id", provider.clientId);
  formParams.append("redirect_uri", provider.buildRedirectUri());

  const token = Buffer.from(
    `${provider.clientId}:${provider.clientSecret}`,
    "binary",
  ).toString("base64");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + token,
    },
    body: formParams.toString(),
  });

  const json = await response.json();

  return {
    accessToken: json.access_token,
    refreshToken: json.refresh_token,
  };
};

const SpotifyProvider = new IntegrationProvider(
  IntegrationProviderId.SPOTIFY,
  "Spotify",
  process.env.SPOTIFY_CLIENT_ID!,
  process.env.SPOTIFY_CLIENT_SECRET!,
  "user-read-private user-read-email user-read-recently-played",
  "https://accounts.spotify.com/authorize",
  handleAuthCallback,
);

export default SpotifyProvider;
