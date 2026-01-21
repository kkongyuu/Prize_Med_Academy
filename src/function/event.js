import api from "./api";
import { encryptStorage } from "../utils/storage";

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${encryptStorage.getItem("accessToken")}`,
  },
});

export const refreshAccessToken = async () => {
  try {
    const response = await api.post("/refreshToken", {
      refreshToken: encryptStorage.getItem("refreshToken"),
    });

    const { accessToken } = response.data;

    // เก็บ Access Token ใหม่ลง Storage
    encryptStorage.setItem("accessToken", accessToken);

    return accessToken;
  } catch (error) {
    console.error("Refresh Token Failed:", error.response?.data);
    // ถ้า Refresh ไม่ได้ (เช่น Refresh Token ใน Cookie หมดอายุด้วย)
    // ต้องให้ Logout หรือเด้งไปหน้า Login
    encryptStorage.removeItem("accessToken");
    window.location.href = "/login";
    throw error;
  }
};

export const getEvent = async () => {
  try {
    console.log("BASE_URL_API:", import.meta.env.VITE_BASE_URL_API);
    const response = await api.get("/getAllEvents");
    // console.log("Event data:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

// ฟังก์ชันช่วยในการเรียก API ที่ต้องการ Authentication
const withAuthRetry = async (apiCall) => {
  try {
    return await apiCall();
  } catch (error) {
    // ถ้าเจอ 403 (Forbidden) ให้พยายาม Refresh Token
    if (error.response?.status === 403) {
      console.log("Token expired, attempting refresh...");
      try {
        await refreshAccessToken(); // ขอ Token ใหม่และเซฟลง storage
        return await apiCall(); // ยิงคำสั่งเดิมซ้ำอีกครั้ง
      } catch (refreshError) {
        throw refreshError; // ถ้า Refresh ไม่ผ่าน ให้เด้งไปหน้า Login (ตาม logic ใน refreshAccessToken)
      }
    }
    throw error;
  }
};

// --- ปรับวิธีเรียกใช้ใน Export Functions ---

export const createEvent = async (eventData) => {
  return withAuthRetry(() =>
    api.post("/createEvent", eventData, getAuthHeader()),
  );
};

export const updateEvent = async (eventId, updatedData) => {
  return withAuthRetry(() =>
    api.post(`/updateEvent/${eventId}`, updatedData, getAuthHeader()),
  );
};

export const deleteEvent = async (eventId) => {
  return withAuthRetry(() =>
    api.delete(`/deleteEvent/${eventId}`, getAuthHeader()),
  );
};

export const manageEnrollments = async (eventId) => {
  return withAuthRetry(() =>
    api.get(`/manageEnrollments/${eventId}`, getAuthHeader()),
  );
};

export const updateEnrollmentStatus = async (data) => {
  return withAuthRetry(() =>
    api.post("/updateEnrollmentPayment", data, getAuthHeader()),
  );
};
