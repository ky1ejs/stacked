import { gql } from "graphql-tag";

// todo: how to get the types from the resolvers?
const typeDefs = gql`
  type Query {
    recentlyPlayed: RecentlyPlayed
    recentActivities: [Activity]
  }

  type RecentlyPlayed {
    name: String
    previewUrl: String
    url: String
    imageUrl: String
    artistName: String
  }

  type Activity {
    id: String
    name: String
    type: String
    distance: Float
    startDateLocal: String
    timezone: String
    elapsedTime: Float
  }
`;

export default typeDefs;
