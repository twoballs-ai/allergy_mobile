import AsyncStorage from "@react-native-async-storage/async-storage";

const TokenService = {
  async getLocalAccessToken() {
    return await AsyncStorage.getItem("accessToken");
  },
  async updateLocalAccessToken(token: string) {
    await AsyncStorage.setItem("accessToken", token);
  },
  async removeTokens() {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
  },
  async getLocalRefreshToken() {
    return await AsyncStorage.getItem("refreshToken");
  },
};

export default TokenService;
