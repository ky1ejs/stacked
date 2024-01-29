import { gql } from "graphql-tag";

// todo: how to get the types from the resolvers?
const typeDefs = gql`
  type Query {
    recentlyPlayed: RecentlyPlayed
  }

  type RecentlyPlayed {
    name: String
    previewUrl: String
    url: String
    imageUrl: String
    artistName: String
  }
`;

export default typeDefs;
