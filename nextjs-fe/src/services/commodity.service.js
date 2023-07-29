import { APIClient } from "helpers/api_helper";
const API_URL = process.env.NEXT_PUBLIC_URL_COMMODITY_SERVICE;
const api = new APIClient();

export const commodityService = {
    getOneCommo,
    updateCommo,
    createCommo,
    getCommoList,
    getTransaction,
    getItems,
    getItemList,
    getOneItem,
    updateItem,
    getOneInstrument,
    updateInstrument,
    createItem,
    createInstrument,
    getListCommodity,
    getContract,
    getOneContract,
    updateContract,
    createContract,
    getSettings,
    getPrinciples,
    generateContracts,
};
async function getOneCommo(id) {
    return api
      .get(API_URL + "/commodity/" + id)
      .catch((e) => console.log(e));
}
async function updateCommo(id,body) {
    return api
      .put(API_URL + "/commodity/" + id,body)
      .catch((e) => console.log(e));
}
async function createCommo(body) {  
    return api
      .create(API_URL + "/commodity",body)
      .catch((e) => console.log(e));
}
async function getCommoList() {
  return api
    .get(API_URL + "/commodity" )
    .catch((e) => console.log(e));
}
async function getTransaction() {
  return api
    .get(API_URL + "/transaction-type" )
    .catch((e) => console.log(e));
}

async function getItems(body) {
  return api
    .get(API_URL + "/item", body )
    .catch((e) => console.log(e));
}
async function getItemList() {
  return api
    .get(API_URL + "/item" )
    .catch((e) => console.log(e));
}
async function getOneItem(id) {
  return api
    .get(API_URL + "/item/"+id )
    .catch((e) => console.log(e));
}

async function updateItem(id,body) {
  return api
    .put(API_URL + "/item/" + id,body)
    .catch((e) => console.log(e));
}
async function createItem(body) {  
  return api
    .create(API_URL + "/item",body)
    .catch((e) => console.log(e));
}

async function getOneInstrument(id){
  return api
  .get(API_URL + "/instrument/"+id )
  .catch((e) => console.log(e));
}

async function updateInstrument(id,body) {
  return api
    .put(API_URL + "/instrument/" + id,body)
    .catch((e) => console.log(e));
}
async function createInstrument(body) {
  return api
  .create(API_URL + "/instrument",body)
  .catch((e) => console.log(e));
}
async function getListCommodity(body) {
  return api
  .get(API_URL + "/commodity",body)
  .catch((e) => console.log(e));
}
async function getContract(body) {
  return api
  .get(API_URL + "/contract",body)
  .catch((e) => console.log(e));
}
async function getOneContract(id) {
  return api
    .get(API_URL + "/contract/" + id)
    .catch((e) => console.log(e));
}
async function updateContract(id,body) {
  return api
    .put(API_URL + "/contract/" + id,body)
    .catch((e) => console.log(e));
}
async function createContract(body) {
  return api
    .create(API_URL + "/contract",body)
    .catch((e) => console.log(e));
}
async function getSettings(body) {
  return api
  .get(API_URL + "/items/aggregation",body)
  .catch((e) => console.log(e));
}
async function getPrinciples(body) {
  return api
  .get(API_URL + "/principles",body)
  .catch((e) => console.log(e));
}
async function generateContracts(body) {
  return api
  .create(API_URL + "/contracts",body)
  .catch((e) => console.log(e));
}