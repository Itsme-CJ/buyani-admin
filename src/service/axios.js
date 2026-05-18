import { default as axiosInstance } from 'axios';
import { getLocalStorageItem, isTokenExpired, setLocalStorageItem } from '../utility';
import { BEARER } from '../utility/constant';

const axios = axiosInstance.create({
  baseURL: window.API_BASE_PATH
});

axios.interceptors.request.use(
  async (config) => {
    const token = getLocalStorageItem('token');
    if (token && isTokenExpired(token.accessToken)) {
      setLocalStorageItem('user', '');
      setLocalStorageItem('token', '');
      window.location.href = '/portal';
    }

    if (token) {
      config.headers.Authorization = `${BEARER}${token.accessToken}`;
    }

    console.log(`Request from ${config.method.toUpperCase()} ${config.url}`, config);

    return config;
  }, (error) => {
    console.log(`Request error from ${error.config.method.toUpperCase()} ${error.config.url}`, error.response);

    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    console.log(`Response from ${response.config.method.toUpperCase()} ${response.config.url}`, response);

    return response;
  }, (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(`Response error from ${error.config.method.toUpperCase()} ${error.config.url}`, error.response);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(`Response error from ${error.config.method.toUpperCase()} ${error.config.url}`, error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log(`Response error from ${error.config.method.toUpperCase()} ${error.config.url}`, error.message);
    }

    return Promise.reject(error);
  }
);

export default axios;