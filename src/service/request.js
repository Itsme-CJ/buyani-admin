import axios  from 'axios';
import axiosInstance  from './axios'
import { API_METHOD } from '../utility/constant';

let source;

export const request = (config) => {
  if (config.method === API_METHOD.GET) {
    return axiosInstance.get(config.url, {
      params: config.params,
      headers : config.headers,
      signal: config.controller?.signal
    });
  } else if (config.method === API_METHOD.POST) {
    return axiosInstance.post(config.url, config.data, { headers: config.headers });
  } else if (config.method === API_METHOD.PATCH) {
    return axiosInstance.patch(config.url, config.data, { headers: config.headers });
  } else if (config.method === API_METHOD.PUT) {
    return axiosInstance.put(config.url, config.data, { headers: config.headers });
  } else if (config.method === API_METHOD.DELETE) {
    return axiosInstance.delete(config.url, {
      headers: config.headers,
      data: config.data
    });
  }
}

export const cancelRequest = () => source.cancel();

export const multipleRequest = (requests) => axios.all(requests);