// Author: TrungQuanDev: https://youtube.com/@trungquandev

import axios from "axios";
import { handleLogoutApi, refreshTokenApi } from "~/apis";

let authorizedAxiosInstance = axios.create();
import { toast } from "react-toastify";
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10;
// cho phép gửi kèm cookie
authorizedAxiosInstance.defaults.withCredentials = true;

// request
authorizedAxiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// response

let refreshTokenPromise = null;
authorizedAxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log(error.response?.status);

    if (error.response?.status === 401) {
      handleLogoutApi().then(() => {
        location.href = "/login";
      });
    }

    const originalRequest = error.config;

    // if (error.response?.status === 410 && !originalRequest._retry) {
    //   originalRequest._retry = true;
    if (error.response?.status === 410 && originalRequest) {
      if (!refreshTokenPromise) {
        const refreshToken = localStorage.getItem("refreshToken");
        refreshTokenPromise = refreshTokenApi(refreshToken)
          .then((res) => {
            const { accessToken } = res.data;
            localStorage.setItem("accessToken", accessToken);
            authorizedAxiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`;
          })
          .catch((err) => {
            handleLogoutApi().then(() => {
              location.href = "/login";
            });
            return Promise.reject(err);
          })
          .finally(() => {
            refreshTokenPromise = null;
          });
      }
      return refreshTokenPromise.then(() => {
        // return lại axios instance kết hợp với originalRequest để gọi lại những api ban đầu bị lỗi
        return authorizedAxiosInstance(originalRequest);
      });
    }

    if (error.response?.status !== 410) {
      toast.error(error.response?.data?.message || error?.message);
    }
    return Promise.reject(error);
  }
);

export default authorizedAxiosInstance;
