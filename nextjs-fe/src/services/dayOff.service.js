import { APIClient } from "helpers/api_helper";
const API_URL = process.env.NEXT_PUBLIC_URL_DAY_OFF;
const api = new APIClient();

export const dayOffService = {
    createFixedDayOff,
    createUnfixedDayOff,
    getDayOff,
    getDayOffs,
    getListDayOffs,
    getFixedDayOff,
    getUnfixedDayOff,
    updateFixedDayOff,
    updateUnfixedDayOff,
    getApprovalDayOff,
    approveDayOff,
    deleteDayOff,
};
async function createFixedDayOff(body) {
    return api
        .create(API_URL + "day-off/fixed", body)
        .catch((e) => console.log(e));
}
async function createUnfixedDayOff(body) {
    return api
        .create(API_URL + "day-off/unfixed", body)
        .catch((e) => console.log(e));
}
async function getDayOff(id) {
    return api
        .get(API_URL + "day-off/" + id)
        .catch((e) => console.log(e));
}
async function getDayOffs(params) {
    return api
        .get(API_URL + "day-off", params)
        .catch((e) => console.log(e));
}
async function getListDayOffs(params) {
    return api
        .get(API_URL + "day-off/list", params)
        .catch((e) => console.log(e));
}
async function getFixedDayOff(params) {
    return api
        .get(API_URL + "day-off/fixed", params)
        .catch((e) => console.log(e));
}
async function getUnfixedDayOff(params) {
    return api
        .get(API_URL + "day-off/unfixed", params)
        .catch((e) => console.log(e));
}
async function updateFixedDayOff(body) {  
    return api
        .create(API_URL + "day-off/fixed/update", body)
        .catch((e) => console.log(e));
}
async function updateUnfixedDayOff(body) {  
    return api
        .create(API_URL + "day-off/unfixed/update", body)
        .catch((e) => console.log(e));
}
async function getApprovalDayOff(id) {
    return api
        .get(API_URL + "day-off/approval/" + id)
        .catch((e) => console.log(e));
}
async function approveDayOff(body) {
    return api
        .put(API_URL + "day-off/approval", body)
        .catch((e) => console.log(e));
}
async function deleteDayOff(id) {
    return api
        .delete(API_URL + "day-off/" + id)
        .catch((e) => console.log(e));
}