import {APIClient} from "helpers/api_helper";
const API_URL = process.env.NEXT_PUBLIC_URL_AUTH_SERVICE;
const api = new APIClient();
export const userService = {
  getUser,
  editUser,
  createUser,
  changePassword,
};

async function getUser(id) {
  return api.get(API_URL + "/user/show/" + id).catch((e) => console.log(e));
}
async function editUser(id, data) {
  return api.put(API_URL + "/am/users/" + id, data).catch((e) => console.log(e));
}
async function createUser(data) {
  return api.create(API_URL + "/user/new", data).catch((e) => console.log(e));
}
async function changePassword(id, old_password, new_password) {
  return api
    .create(API_URL + "/am/users/" + id + "/changePassword", {old_password, new_password})
    .catch((e) => console.log(e));
}
