import {APIClient} from "helpers/api_helper";
const API_URL = process.env.NEXT_PUBLIC_URL_LOG_SERVICE;
const api = new APIClient();
export const ActivityHistoryService = {
  getListActivityHistory,
};

async function getListActivityHistory(data) {
  return api.get(API_URL + "/activity-history", {...data}).catch((e) => console.log(e));
}
