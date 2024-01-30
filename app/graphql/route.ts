import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { NextRequest } from "next/server";
import resolvers from "@/graphql/resolvers";
import typeDefs from "@/graphql/schema";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";

let plugins = [];
if (process.env.NODE_ENV === "production") {
  plugins = [ApolloServerPluginLandingPageLocalDefault({ embed: true })];
} else {
  plugins = [ApolloServerPluginLandingPageLocalDefault({ embed: true })];
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  plugins,
});

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req) => ({ req }),
});

export { handler as GET, handler as POST };
