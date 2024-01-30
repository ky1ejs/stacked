import { Axios } from "axios";
import RecentlyPlayed from "@/integration/spotify/model/RecentlyPlayed";
import AuthCreds from "@/integration/tokens";

export const fetchRecentlyPlayed = async (
  client: Axios,
  creds: AuthCreds,
): Promise<RecentlyPlayed | undefined> => {
  const url = "https://api.spotify.com/v1/me/player/recently-played";
  const headers = {
    Authorization: `Bearer ${creds.accessToken}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await client.get(url, { headers });

    if (!response.data || response.status !== 200) {
      throw new Error("Non 200 status received when fetching recently played.");
    }

    const track = response.data.items[0].track;
    return {
      name: track.name,
      url: track.external_urls.spotify,
      imageUrl: track.album.images[0].url,
      previewUrl: track.preview_url,
      artistName: track.album.artists[0].name,
    };
  } catch (e) {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const error = e as any;
    console.log(error.response.data);
    throw e;
  }
};
