import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { encryptStorage } from "../utils/storage";

export const PrivateRoute = () => {
  // ตรวจสอบ Token จาก LocalStorage
  const token = encryptStorage.getItem("accessToken");
  const refreshToken = encryptStorage.getItem("refreshToken");

  console.log("Access Token:", token);
  console.log("Refresh Token:", refreshToken);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // หากมี Token ให้แสดง Component ลูก (ManagePage, AddEvents ฯลฯ)
  return <Outlet />;
};

export const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${encryptStorage.getItem("accessToken")}`,
  },
});

export const withAuthRetry = async (apiCall) => {
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
