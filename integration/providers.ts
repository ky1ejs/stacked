import SpotifyProvider from "@/integration/spotify/SpotifyProvider";
import StravaProvider from "@/integration/strava/StravaProvider";

const PROVIDERS = new Map(
  [SpotifyProvider, StravaProvider].map((obj) => [obj.id, obj]),
);

export default PROVIDERS;
