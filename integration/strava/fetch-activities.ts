import { Axios } from "axios";
import AuthCreds from "../AuthCreds";
import Activity from "./model/Activity";

// https://developers.strava.com/docs/reference/#api-Activities-getLoggedInAthleteActivities
export const fetchRecentActivities = async (
  http: Axios,
  creds: AuthCreds,
): Promise<Activity[] | undefined> => {
  const url = "https://www.strava.com/api/v3/athlete/activities?per_page=5";
  const headers = {
    Authorization: `Bearer ${creds.accessToken}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await http.get(url, { headers });

    if (!response.data || response.status !== 200) {
      throw new Error("Non 200 status received when fetching recently played.");
    }

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const activities = response.data as any[];
    console.log(activities);
    return activities.map((activity) => ({
      id: activity.id,
      name: activity.name,
      type: activity.type,
      distance: activity.distance,
      startDateLocal: activity.start_date_local,
      timezone: activity.timezone,
      elapsedTime: activity.elapsed_time,
    }));
  } catch (e) {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const error = e as any;
    console.log(error.response.data);
    throw e;
  }
};
