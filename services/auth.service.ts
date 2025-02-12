import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthService = {
  async refreshToken() {
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    const response = await api.post("auth/refresh/", { refresh_token: refreshToken });
    return response.data;
  },
};

export default AuthService;
