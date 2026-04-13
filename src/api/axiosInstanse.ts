import axios from "axios";

export const api = axios.create({
  baseURL: "https://mis-api.kreosoft.space/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      if (window.location.pathname !== "/login") {
        localStorage.removeItem("token");

        window.location.assign("/login");
      }
    }
    return Promise.reject(error);
  },
);
