import api from "./api";

export const createEnrollment = async (event_id, enrollmentData) => {
  try {
    const response = await api.post(
      `/enrollmentEvent/${event_id}`,
      enrollmentData,
    );
    return response.data;
  } catch (error) {
    console.error("Error creating enrollment:", error);
    throw error;
  }
};

export const findEnrollmentByPhone = async (data) => {
  try {
    // แก้ไขจุดที่ 1: เปลี่ยนจาก .get เป็น .post
    // แก้ไขจุดที่ 2: data ที่รับมาควรเป็น object { phone: '...' }
    const response = await api.post(`/findEnrollmentByPhone`, data);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "เกิดข้อผิดพลาดในการค้นหา";
    console.error("Error finding enrollment by phone:", message);
    return { success: false, message };
  }
};
