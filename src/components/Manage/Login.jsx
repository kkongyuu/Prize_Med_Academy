import React, { useState } from "react";
import { User, Lock, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
// 1. Import ฟังก์ชัน loginAdmin ที่เราเขียนไว้ (ตรวจสอบ Path ให้ถูกต้อง)
import { loginAdmin } from "../../function/admin";

function Login_component() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // เพิ่มสถานะ Loading
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true); // เริ่มโหลด

    try {
      // 2. เรียกใช้ loginAdmin (ตัวนี้จะทำ encryptStorage.setItem ให้เองภายใน)
      await loginAdmin(username, password);

      alert("เข้าสู่ระบบสำเร็จ");
      navigate("/manage");
    } catch (err) {
      // แสดงข้อความ Error ที่มาจาก Backend หรือ Error ทั่วไป
      alert(err.message || "Username หรือ Password ไม่ถูกต้อง");
    } finally {
      setIsLoading(false); // จบการโหลด
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-pink-100 p-6">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white p-8 md:p-12 transition-all hover:shadow-pink-200/50">
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-2xl mb-4 shadow-inner">
            <span className="text-3xl">🩺</span>
          </div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
            Prize Med Academy
          </h1>
          <p className="text-gray-400 mt-2 font-light">
            ระบบบริหารจัดการสำหรับผู้ดูแลระบบ
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Username Field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 ml-1">
              ชื่อผู้ใช้งาน (Username)
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-pink-500 transition-colors">
                <User size={18} />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 focus:bg-white outline-none transition-all"
                placeholder="กรอกชื่อผู้ใช้งานของคุณ"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 ml-1">
              รหัสผ่าน
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-pink-500 transition-colors">
                <Lock size={18} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 focus:bg-white outline-none transition-all"
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading} // ปิดปุ่มระหว่างโหลด
            className={`w-full py-4 bg-gradient-to-r from-pink-600 to-rose-500 text-white rounded-2xl font-bold shadow-lg shadow-pink-200 transition-all flex items-center justify-center gap-2 group ${
              isLoading
                ? "opacity-70 cursor-not-allowed"
                : "hover:shadow-pink-300 hover:translate-y-[-2px] active:translate-y-[0px]"
            }`}
          >
            <span>{isLoading ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบ"}</span>
            {!isLoading && (
              <LogIn
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-gray-500 text-sm">
            ต้องการความช่วยเหลือ?{" "}
            <a
              href="#"
              className="text-pink-600 font-bold hover:text-pink-700 transition-colors"
            >
              ติดต่อผู้ดูแลระบบ
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Login_component;
