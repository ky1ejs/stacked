import { Axios } from "axios";
import createRefreshingClient from "../createRefreshingClient";
import AuthCreds from "../AuthCreds";
import { fetchRecentActivities } from "./fetch-activities";
import Activity from "./model/Activity";
import { refreshStravaToken } from "./refreshStravaToken";

class Strava {
  private readonly client: Axios;
  private readonly creds: AuthCreds;

  constructor(creds: AuthCreds) {
    this.client = createRefreshingClient(refreshStravaToken, creds);
    this.creds = creds;
  }

  async fetchRecentActivities(): Promise<Activity[] | undefined> {
    return fetchRecentActivities(this.client, this.creds);
  }
}

export default Strava;
