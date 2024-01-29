import { IntegrationProviderId } from "@prisma/client";
import IntegrationProvider from "./IntegrationProvider";
import prisma from "@/prisma/db";

const SpotifyProvider: IntegrationProvider = {
  id: IntegrationProviderId.SPOTIFY,
  displayName: "Spotify",
  clientId: process.env.SPOTIFY_CLIENT_ID!,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
  authUrlBuilder: buildAuthUrl,
  handleAuthCallback,
};

function buildAuthUrl() {
  const state = (Math.random() + 1).toString(36).substring(7);

  const params = new URLSearchParams();
  params.append("client_id", SpotifyProvider.clientId);
  params.append("redirect_uri", "http://localhost:3000/api/callback/spotify");
  params.append("scope", "user-read-private user-read-email");
  params.append("state", state);
  params.append("response_type", "code");

  return "https://accounts.spotify.com/authorize?" + params.toString();
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
  formParams.append("client_id", SpotifyProvider.clientId);
  formParams.append(
    "redirect_uri",
    "http://localhost:3000/api/callback/spotify",
  );

  const token = Buffer.from(
    `${SpotifyProvider.clientId}:${SpotifyProvider.clientSecret}`,
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

  await prisma.userIntegration.upsert({
    where: {
      integration_user_unique: {
        userId: userId,
        integrationProvider: SpotifyProvider.id,
      },
    },
    update: {
      accessToken: json.access_token,
      refreshToken: json.refresh_token,
    },
    create: {
      accessToken: json.access_token,
      refreshToken: json.refresh_token,
      integrationProvider: SpotifyProvider.id,
      userId,
    },
  });
}

export default SpotifyProvider;
