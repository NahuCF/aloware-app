import axios from "axios";
import store from "@/store";
import router from "@/router";

const Http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: "application/json",
  },
});

Http.interceptors.request.use((config) => {
  const token = store.state.auth.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

Http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch("auth/logout");
      router.push("/login");
    }
    return Promise.reject(error);
  }
);

export default Http;
