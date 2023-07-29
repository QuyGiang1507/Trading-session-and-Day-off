import {BehaviorSubject} from "rxjs";
import Router from "next/router";
import jwt_decode from "jwt-decode";

import {APIClient} from "helpers/api_helper";

const userSubject = new BehaviorSubject(
  process.browser && JSON.parse(localStorage.getItem("verifyPin"))
);
const API_URL = process.env.NEXT_PUBLIC_URL_AUTH_SERVICE;
const api = new APIClient();

export const authService = {
  user: userSubject.asObservable(),
  get userValue() {
    return userSubject.value;
  },
  login,
  microsoftLogin,
  logout,
  lockscreen,
  verifyPIN
};

async function login(email, password) {
    return api.create(API_URL+"/user/login", { email, password })
        .then(response => {
            // publish user to subscribers and store in local storage to stay logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(jwt_decode(JSON.stringify(response.payload.data))));
            localStorage.setItem('token', response.payload.data);
  });
}

async function verifyPIN(id,body){
  return api
  .create(API_URL + "/verifyPIN/"+id,body)
  .then(response => {
    // publish user to subscribers and store in local storage to stay logged in between page refreshes
    userSubject.next(jwt_decode(JSON.stringify(response.payload.data)));
    localStorage.setItem('verifyPin',true)
    localStorage.setItem('userRoles',response.payload.userRoles)
    localStorage.setItem('loginTime',Date())
    localStorage.setItem('token', response.payload.data);
    localStorage.setItem('user', JSON.stringify(jwt_decode(JSON.stringify(response.payload.data))));
  })  
  
}

async function microsoftLogin(accessToken) {
  return api
    .create(API_URL + "/microsoftLogin", {accessToken: accessToken})
    .then((response) => {
      if (response.userExisted) {
        userSubject.next(jwt_decode(JSON.stringify(response.data)));
        localStorage.setItem("token", response.data);
        localStorage.setItem(
          "user",
          JSON.stringify(jwt_decode(JSON.stringify(response.data)))
        );
      } else {
        Router.push("/account/register");
      }
    });
}

function logout() {
  // remove user from local storage, publish null to user subscribers and redirect to login page
  localStorage.clear();
  userSubject.next(null);
  Router.push("/");
}

function lockscreen() {
  if (localStorage.getItem("user")) {
    const user = JSON.parse(localStorage.getItem("user"));
    localStorage.clear();
    localStorage.setItem("lockUser", JSON.stringify(user));
    userSubject.next(null);
  }
}

// function checkTimeOut() {
//   if (localStorage.getItem("loginTime")) {
//     const loginTime=new Date(localStorage.getItem('loginTime'))
//     const logoutTime=loginTime
//     logoutTime.setTime(logoutTime.getTime() + 60*1000);
//     if(new Date()> logoutTime){
//       logout()
//     }
//   }
// }
