import { APIClient } from "helpers/api_helper";
const API_URL = process.env.NEXT_PUBLIC_URL_CONFIG_SERVICE;
const api = new APIClient();

export const configService = {
    getConfig,
    updateConfig
};
async function getConfig(key) {
    return api
      .get(API_URL + "/config/show/" + key)
      .catch((e) => console.log(e));
}
async function updateConfig(key,value) {
    return api
      .put(API_URL + "/config/update",{
        key: key,
        value: value
      })
      .catch((e) => console.log(e));
}