import {APIClient} from "helpers/api_helper";
// const API_URL = process.env.NEXT_PUBLIC_URL_LOG_SERVICE;
const API_URL = process.env.NEXT_PUBLIC_URL_GATEWAY;
const api = new APIClient();
export const approvalService = {
  getList,
  getOneForm,
  approveOrReject,
};

async function getList(body, service) {
  
  return api.get(API_URL +"/"+service+ "/approval", body).catch((e) => console.log(e));
}
async function getOneForm(id, service) {
  return api.get(API_URL +"/"+service+ "/approval/"+id).catch((e) => console.log(e));
}
async function approveOrReject(id, service, body) {
  return api.put(API_URL +"/"+service+ "/approval/"+id, body)
}