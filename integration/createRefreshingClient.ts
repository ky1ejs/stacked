import axios, { Axios } from "axios";
import AuthCreds from "./AuthCreds";
import prisma from "@/prisma/db";
import Tokens from "./tokens";

type TokenRefresher = (client: Axios, creds: AuthCreds) => Promise<Tokens>;

function createRefreshingClient(
  tokenRefresher: TokenRefresher,
  creds: AuthCreds,
) {
  const client = axios.create();

  /* eslint-disable @typescript-eslint/no-explicit-any */
  client.interceptors.response.use(undefined, async (error: any) => {
    const response = error.response;

    if (
      response?.status === 401 &&
      error.config &&
      !error.config.__isRetryRequest
    ) {
      try {
        const tokens = await tokenRefresher(client, creds);
        error.config.__isRetryRequest = true;
        error.config.headers = {
          ...error.config.headers,
          Authorization: `Bearer ${tokens.accessToken}`,
        };

        prisma.userIntegration.update({
          where: { id: creds.integrationId },
          data: {
            refreshToken: tokens.refreshToken,
            accessToken: tokens.accessToken,
          },
        });

        return client.request(error.config);
      } catch (authError) {
        // refreshing has failed, but report the original error, i.e. 401
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  });

  return client;
}

export default createRefreshingClient;
