import axios from "axios";
import {toast} from "react-toastify";
import {authService} from "services";
// default
// content type
axios.defaults.headers.post["Content-Type"] = "application/json";

// content type

// intercepting to capture errors

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    if (response.data.status == 2)
      toast("Tạo bản phê duyệt thành công", {className: "bg-success text-white"});
    return response.data
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    switch (error.response.status) {
      case 401:
        toast(error.response.data.errors[0].message, {className: "bg-danger text-white"});
        authService.logout();
        break;
      case 403:
        toast(error.response.data.errors[0].message, {className: "bg-danger text-white"});
        authService.logout();
        break;
      default:
        toast(error.response.data.errors[0].message, {className: "bg-danger text-white"});
        break;
    }
    return Promise.reject(error.response);
  }
);
/**
 * Sets the default authorization
 * @param {*} token
 */
const setAuthorization = (token) => {
  axios.defaults.headers.common["Authorization"] = "Bearer " + token;
};

class APIClient {
  /**
   * Fetches data from given url
   */

  get = (url, params) => {
    return axios.get(url, {params: params});
  };
  // get = (url, params) => {
  //   let response;

  //   let paramKeys = [];

  //   if (params) {
  //     Object.keys(params).map(key => {
  //       paramKeys.push(key + '=' + params[key]);
  //       return paramKeys;
  //     });

  //     const queryString = paramKeys && paramKeys.length ? paramKeys.join('&') : "";
  //     response = axios.get(`${url}?${queryString}`, params);
  //   } else {
  //     response = axios.get(`${url}`, params);
  //   }

  //   return response;
  // };
  /**
   * post given data to url
   */
  create = (url, data) => {
    return axios.post(url, data);
  };
  /**
   * Updates data
   */
  update = (url, data) => {
    return axios.patch(url, data);
  };
  /**
   * Put data
   */
  put = (url, data) => {
    return axios.put(url, data);
  };
  /**
   * Delete
   */
  delete = (url, config) => {
    return axios.delete(url, {...config});
  };
}
const getLoggedinUser = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  } else {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    return token;
  }
};

export {APIClient, setAuthorization, getLoggedinUser};
