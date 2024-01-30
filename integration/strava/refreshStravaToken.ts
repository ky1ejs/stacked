import { Axios } from "axios";
import qs from "qs";
import AuthCreds from "../AuthCreds";
import Tokens from "../tokens";

export const refreshStravaToken = async (
  http: Axios,
  config: AuthCreds,
): Promise<Tokens> => {
  const url = "https://www.strava.com/api/v3/oauth/token";
  const form = {
    grant_type: "refresh_token",
    refresh_token: config.refreshToken,
    client_id: config.clientId,
    client_secret: config.clientSecret,
  };

  const r = await http.post(url, qs.stringify(form));
  if (!r.data || r.status != 200) {
    console.log(`Failed to refresh token - ${r.data}`);
    throw new Error("Failed to refresh token");
  }

  return {
    accessToken: r.data.access_token,
    refreshToken: r.data.refresh_token,
  };
};
