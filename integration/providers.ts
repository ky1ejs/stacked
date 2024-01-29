import { IntegrationProviderId } from "@prisma/client";
import IntegrationProvider from "./IntegrationProvider";
import SpotifyProvider from "./spotify";
import StravaProvider from "./strava";

const PROVIDERS = new Map(
  [SpotifyProvider, StravaProvider].map((obj) => [obj.id, obj]),
);

export default PROVIDERS;
