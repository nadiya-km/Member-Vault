import axios from "axios";
import secureLocalStorage from "react-secure-storage";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});



api.interceptors.request.use((config) => {
  const token = secureLocalStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refreshToken =
        secureLocalStorage.getItem("refreshToken");

      if (!refreshToken) {
        secureLocalStorage.clear();
        window.location.href = "/login";
        return;
      }

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/auth/refresh`,
          { refreshToken }
        );

        secureLocalStorage.setItem(
          "accessToken",
          res.data.accessToken
        );

        originalRequest.headers.Authorization =
          `Bearer ${res.data.accessToken}`;

        return api(originalRequest);
      } catch {
        secureLocalStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
