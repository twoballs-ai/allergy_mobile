import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const instance = axios.create({
  baseURL: "http://10.0.2.2:8001/", // Укажите ваш бэкэнд
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor for requests
instance.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error retrieving token from storage", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for responses
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalConfig = error.config;

    if (error.response && error.response.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;
      try {
        const AuthService = (await import("./auth.service")).default; // Отложенная загрузка
        const rs = await AuthService.refreshToken();
        const accessToken = rs.access_token;

        if (accessToken) {
          await AsyncStorage.setItem("accessToken", accessToken);
          instance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
          return instance(originalConfig);
        }
      } catch (err) {
        console.error("Error refreshing token:", err);
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
