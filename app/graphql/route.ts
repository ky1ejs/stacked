import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { NextRequest } from "next/server";
import allowCors from "@/graphql/utils/cors";
import resolvers from "@/graphql/resolvers";
import typeDefs from "@/graphql/schema";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req) => ({ req }),
});

const cors = allowCors(handler);

export { handler as GET, handler as POST };
