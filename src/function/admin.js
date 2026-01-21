import api from "./api";
import { encryptStorage } from "../utils/storage";

export const loginAdmin = async (username, password) => {
  try {
    const response = await api.post("/loginAdmin", {
      username,
      password,
    });

    if (response.data.accessToken) {
      // ข้อมูลที่บันทึกจะถูกเข้ารหัสทันที
      console.log("Storing tokens in encrypted storage");
      console.log(" store:", response);
      encryptStorage.setItem("accessToken", response.data.accessToken);
      encryptStorage.setItem("refreshToken", response.data.refreshToken);
    }

    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

export const refreshToken = async () => {
  try {

    const response = await api.get("/refreshTokenAdmin");

    return response.data;
  } catch (error) {
    console.error("Refresh Token Error:", error);
    throw error;
  }
};
