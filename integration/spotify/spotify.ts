import { Axios } from "axios";
import createRefreshingClient from "../createRefreshingClient";
import AuthCreds from "../AuthCreds";
import { fetchRecentlyPlayed } from "./fetchers/fetch-recently-played";
import { refreshAccessToken } from "./token";
import RecentlyPlayed from "./model/RecentlyPlayed";

class Spotify {
  private readonly client: Axios;
  private readonly creds: AuthCreds;

  constructor(creds: AuthCreds) {
    this.client = createRefreshingClient(refreshAccessToken, creds);
    this.creds = creds;
  }

  async fetchRecentlyPlayed(): Promise<RecentlyPlayed | undefined> {
    return fetchRecentlyPlayed(this.client, this.creds);
  }
}

export default Spotify;
