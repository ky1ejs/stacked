import { Axios } from "axios";
import qs from "qs";
import AuthCreds from "../AuthCreds";
import Tokens from "../tokens";

export const refreshSpotifyToken = async (
  http: Axios,
  config: AuthCreds,
): Promise<Tokens> => {
  const url = "https://accounts.spotify.com/api/token";
  const auth = Buffer.from(
    `${config.clientId}:${config.clientSecret}`,
    "binary",
  ).toString("base64");
  const form = {
    grant_type: "refresh_token",
    refresh_token: config.refreshToken,
  };
  const headers = {
    "content-type": "application/x-www-form-urlencoded",
    Authorization: `Basic ${auth}`,
  };

  const r = await http.post(url, qs.stringify(form), { headers });
  if (!r.data || r.status != 200) {
    console.log(`Failed to refresh token - ${r.data}`);
    throw new Error("Failed to refresh token");
  }
  return {
    accessToken: r.data.access_token,
    refreshToken: r.data.refresh_token,
  };
};
