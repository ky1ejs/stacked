import Spotify from "@/integration/spotify/Spotify";
import Strava from "@/integration/strava/Stava";
import prisma from "@/prisma/db";

const resolvers = {
  Query: {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    recentlyPlayed: async (parent: any, args: any, context: any) => {
      const integration = await prisma.userIntegration.findUnique({
        where: {
          integration_user_unique: {
            userId: context.req.headers.get("account_id"),
            integrationProvider: "SPOTIFY",
          },
        },
      });
      if (!integration) {
        throw new Error("Integration not found.");
      }
      const spotify = new Spotify({
        integrationId: integration.id,
        refreshToken: integration.refreshToken,
        accessToken: integration.accessToken,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
        clientId: process.env.SPOTIFY_CLIENT_ID!,
      });
      return spotify.fetchRecentlyPlayed();
    },
    recentActivities: async (parent: any, args: any, context: any) => {
      const integration = await prisma.userIntegration.findUnique({
        where: {
          integration_user_unique: {
            userId: context.req.headers.get("account_id"),
            integrationProvider: "STRAVA",
          },
        },
      });
      if (!integration) {
        throw new Error("Integration not found.");
      }
      const strava = new Strava({
        integrationId: integration.id,
        refreshToken: integration.refreshToken,
        accessToken: integration.accessToken,
        clientSecret: process.env.STRAVA_CLIENT_SECRET!,
        clientId: process.env.STRAVA_CLIENT_ID!,
      });
      return strava.fetchRecentActivities();
    },
  },
};

export default resolvers;
