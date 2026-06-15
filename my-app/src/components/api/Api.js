import axios from "axios";
import { jwtDecode } from "jwt-decode";

const url = import.meta.env.VITE_APP_BE_API_URL;

const api = axios.create({
  baseURL: url,
  headers: {
    "Content-Type": "application/json",
  },
});

// SAVE USER DATA
export const saveUserData = (token) => {
  try {
    const decoded = jwtDecode(token);

    if (decoded.id) {
      localStorage.setItem("userId", decoded.id);
    }

    if (decoded.role) {
      localStorage.setItem("role", decoded.role);
    }
  } catch (err) {
    console.log("Token Decode Error:", err);
  }
};

// AUTO LOAD EXISTING TOKEN DATA
const existingToken = localStorage.getItem("accessToken");

if (existingToken) {
  saveUserData(existingToken);
}

// REQUEST INTERCEPTOR
api.interceptors.request.use((req) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// REFRESH TOKEN LOGIC
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (originalRequest?.url?.includes("/auth/refresh-token")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        localStorage.clear();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve,
            reject,
          });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;

          return api(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        const response = await axios.post(`${url}/auth/refresh-token`, {
          refreshToken,
        });

        const newToken = response.data.accessToken;

        localStorage.setItem("accessToken", newToken);

        saveUserData(newToken);

        api.defaults.headers.common.Authorization = `Bearer ${newToken}`;

        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (err) {
        processQueue(err);

        localStorage.clear();

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
