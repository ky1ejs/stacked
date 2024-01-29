import { IntegrationProviderId } from "@prisma/client";
import IntegrationProvider from "./IntegrationProvider";
import prisma from "@/prisma/db";

const StravaProvider: IntegrationProvider = {
  id: IntegrationProviderId.STRAVA,
  displayName: "Strava",
  clientId: process.env.STRAVA_CLIENT_ID!,
  clientSecret: process.env.STRAVA_CLIENT_SECRET!,
  authUrlBuilder: buildAuthUrl,
  handleAuthCallback,
};

function buildAuthUrl() {
  const params = new URLSearchParams();
  params.append("client_id", StravaProvider.clientId);
  params.append("redirect_uri", "http://localhost:3000/callback/strava");
  params.append("scope", "read");
  params.append("approval_prompt", "force");
  params.append("response_type", "code");

  return "http://www.strava.com/oauth/authorize?" + params.toString();
}

async function handleAuthCallback(request: Request, userId: string) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    throw new Error("Code not provided.");
  }

  const formParams = new URLSearchParams();
  formParams.append("grant_type", "authorization_code");
  formParams.append("code", code);
  formParams.append("client_id", StravaProvider.clientId);
  formParams.append("client_secret", StravaProvider.clientSecret);

  const response = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body: formParams.toString(),
  });

  const json = await response.json();

  await prisma.userIntegration.upsert({
    where: {
      integration_user_unique: {
        userId: userId,
        integrationProvider: StravaProvider.id,
      },
    },
    update: {
      accessToken: json.access_token,
      refreshToken: json.refresh_token,
    },
    create: {
      accessToken: json.access_token,
      refreshToken: json.refresh_token,
      integrationProvider: StravaProvider.id,
      userId,
    },
  });
}

export default StravaProvider;
