import SpotifyProvider from "@/integration/spotify/spotify";
import StravaProvider from "@/integration/strava/strava";

const PROVIDERS = new Map(
  [SpotifyProvider, StravaProvider].map((obj) => [obj.id, obj]),
);

export default PROVIDERS;
