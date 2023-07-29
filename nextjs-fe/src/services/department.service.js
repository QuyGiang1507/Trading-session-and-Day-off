import { APIClient } from "helpers/api_helper";
const API_URL = process.env.NEXT_PUBLIC_URL_AUTH_SERVICE;
const api = new APIClient();

export const departmentService = {
    getOneDepartment,
    updateDepartment,
    getUser,
    getDepartments,
    updateUser,
    changeDept,
    createDept,
    createUser,
    assignGroupRoles,
    assignRoles,
    resetPassword,
    resetPin,
    changePassword,
    changePin
};
async function getOneDepartment(id, body) {
    return api
      .get(API_URL + "/department/" + id, body)
      .catch((e) => console.log(e));
}
async function updateDepartment(id, department) {
    return api
        .put(API_URL + "/department/" + id,department)
        .catch((e) => console.log(e));
}
async function getUser(userId){
    return api
      .get(API_URL +"/user/"+userId)
      .catch((e) => console.log(e));
}
async function getDepartments(body) {
    return api
      .get(API_URL + "/department", body)
      .catch((e) => console.log(e));
}

async function updateUser(userId,user){
    return api
    .put(API_URL + "/user/profile/"+userId,user)
    .catch((e) => console.log(e));
}


async function changeDept(newDept,userId){
    return api
    .put(API_URL + "/change-department/" + userId,
    {
        newDept: newDept
    })
    .catch((e) => console.log(e));
}

async function createDept(dept){
    return api
    .create(API_URL + "/department",dept)
    .catch((e) => console.log(e));
}

async function createUser(user){
    return api
    .create(API_URL + "/user",user)
    .catch((e) => console.log(e));
}

async function assignGroupRoles(userId,body){
    return api
    .put(API_URL + "/user/assign-group-roles/"+userId,body)
    .catch((e) => console.log(e));
}

async function assignRoles(userId,body){
    return api
    .put(API_URL + "/user/assign-roles/"+userId,body)
    .catch((e) => console.log(e));
}

async function resetPassword(userId){
    return api
    .put(API_URL + "/reset-password/"+userId)
}
async function resetPin(userId){
    return api
    .put(API_URL + "/reset-PIN/"+userId)
    .catch((e) => console.log(e));
}
async function changePassword(userId,body){
    return api
    .put(API_URL + "/change-password/"+userId,body)
    .catch((e) => console.log(e));
}
async function changePin(userId,body){
    return api
    .put(API_URL + "/change-PIN/"+userId,body)
}