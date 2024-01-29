import prisma from "@/prisma/db";
import Spotify from "@/integration/spotify";

const resolvers = {
  Query: {
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
        clientId: process.env.SPOTIFY_CLIENT_ID!,
        secret: process.env.SPOTIFY_CLIENT_SECRET!,
        refreshToken: integration.refreshToken,
      });
      return spotify.fetchRecentlyPlayed();
    },
  },
};

export default resolvers;
