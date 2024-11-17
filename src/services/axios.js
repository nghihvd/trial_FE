import axios from "axios";

export const BASE_URL = "https://furryfriendfundbe.onrender.com/";

const token = localStorage.getItem("token");
const instance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Access-Control-Allow-Origin": "http://localhost:3000",
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  },
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && token !== "null") {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Tạo một đối tượng API để xử lý các phương thức HTTP
const api = {
  get: (url, config = {}) => instance.get(url, config),
  post: (url, data, config = {}) => instance.post(url, data, config),
  put: (url, data, config = {}) => instance.put(url, data, config),
  delete: (url, config = {}) => instance.delete(url, config),
  postForm: (url, data, config = {}) =>
    instance.post(url, data, {
      ...config,
      headers: {
        ...config.headers,
        "Content-Type": "multipart/form-data",
      },
    }),
};

export default api;
