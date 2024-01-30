import { IntegrationProviderId } from "@prisma/client";
import IntegrationProvider, {
  AuthCallbackHandler,
} from "../IntegrationProvider";

const handleAuthCallback: AuthCallbackHandler = async (code, provider) => {
  const formParams = new URLSearchParams();
  formParams.append("grant_type", "authorization_code");
  formParams.append("code", code);
  formParams.append("client_id", provider.clientId);
  formParams.append("client_secret", provider.clientSecret);

  const response = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body: formParams.toString(),
  });

  const json = await response.json();

  return {
    accessToken: json.access_token,
    refreshToken: json.refresh_token,
  };
};

const StravaProvider = new IntegrationProvider(
  IntegrationProviderId.STRAVA,
  "Strava",
  process.env.STRAVA_CLIENT_ID!,
  process.env.STRAVA_CLIENT_SECRET!,
  "http://localhost:3000/callback/strava/bounce",
  "read",
  "http://www.strava.com/oauth/authorize",
  handleAuthCallback,
);

export default StravaProvider;
