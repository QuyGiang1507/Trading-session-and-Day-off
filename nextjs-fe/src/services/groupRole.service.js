import {APIClient} from "helpers/api_helper";
const API_URL = process.env.NEXT_PUBLIC_URL_AUTH_SERVICE;
const CONFIG_URL = process.env.URL_CONFIG_SERVICE;
const api = new APIClient();
export const groupRoleService = {
  createGroupRole,
  getRoleGroups,
  getOneRoleGroup,
  updateOneRoleGroup,
  deleteOneRoleGroup,
};

async function createGroupRole(data) {
  return await api.create(API_URL + "/group-role", data);
}

async function getRoleGroups() {
  return api.get(API_URL + "/group-role").catch((e) => console.log(e));
}
async function getOneRoleGroup(id) {
  return api.get(API_URL + "/group-role/" + id).catch((e) => console.log(e));
}
async function updateOneRoleGroup(id, data) {
  return api.put(API_URL + "/group-role/" + id, data).catch((e) => console.log(e));
}
async function deleteOneRoleGroup(id) {
  return api.delete(API_URL + "/am/roles/" + id).catch((e) => console.log(e));
}
