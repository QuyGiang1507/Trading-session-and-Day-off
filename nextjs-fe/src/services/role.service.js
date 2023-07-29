import {APIClient} from "helpers/api_helper";

const API_AUTH = process.env.NEXT_PUBLIC_URL_AUTH_SERVICE;
const api = new APIClient();
export const roleService = {
  getRoles,
  updateRoles,
};

async function getRoles(data = {}) {
  return await api.get(API_AUTH + "/roles", data);
}

async function updateRoles(data) {
  return await api.put(API_AUTH + "/roles", {
    key: "roles",
    value: data,
  });
}
