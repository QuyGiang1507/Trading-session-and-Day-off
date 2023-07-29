import { APIClient } from "helpers/api_helper";
const API_URL = process.env.NEXT_PUBLIC_URL_TRADING_SESSION;
const api = new APIClient();

export const tradingSessionService = {
    getOneSession,
    getGeneralSession,
    getSessions,
    updateSession,
    createSession,
    createGeneralSession,
    getApprovalSession,
    approveSession,
    deleteSession,
};
async function getOneSession(id) {
    return api
        .get(API_URL + "trading-session/" + id)
        .catch((e) => console.log(e));
}
async function getGeneralSession() {
    return api
        .get(API_URL + "trading-session/general")
        .catch((e) => console.log(e));
}
async function getSessions(params) {
    return api
        .get(API_URL + "trading-session", params)
        .catch((e) => console.log(e));
}
async function updateSession(body) {
    return api
        .create(API_URL + "trading-session/update", body)
        .catch((e) => console.log(e));
    }
async function createSession(body) {  
    return api
        .create(API_URL + "trading-session", body)
        .catch((e) => console.log(e));
}
async function createGeneralSession(body) {  
    return api
        .create(API_URL + "trading-session/general", body)
        .catch((e) => console.log(e));
}
async function getApprovalSession(id) {
    return api
        .get(API_URL + "trading-session/approval/" + id)
        .catch((e) => console.log(e));
}
async function approveSession(body) {
    return api
        .put(API_URL + "trading-session/approval", body)
        .catch((e) => console.log(e));
}
async function deleteSession(id) {
    return api
        .delete(API_URL + "trading-session/" + id)
        .catch((e) => console.log(e));
}