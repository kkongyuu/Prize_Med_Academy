import React, { useState } from "react";
import { User, Mail, Lock, Calendar, UserPlus } from "lucide-react";

function Register_component() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthday: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("รหัสผ่านไม่ตรงกัน");
      return;
    }
    console.log("Registering with:", formData);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-pink-100 p-6">
      <div className="max-w-lg w-full bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-white p-8 md:p-10 transition-all">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent">
            สร้างบัญชีใหม่
          </h1>
          <p className="text-gray-400 mt-2">
            เข้าร่วม Prize Med Academy เพื่อเริ่มต้นใช้งาน
          </p>
        </div>

        {/* Registration Form */}
        <form
          onSubmit={handleRegister}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Username - Full Width */}
          <div className="md:col-span-2 space-y-1">
            <label className="text-sm font-semibold text-gray-600 ml-1">
              ชื่อผู้ใช้งาน
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-pink-500 transition-colors">
                <User size={18} />
              </div>
              <input
                name="username"
                type="text"
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 outline-none transition-all"
                placeholder="Username"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600 ml-1">
              รหัสผ่าน
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-pink-500 transition-colors">
                <Lock size={18} />
              </div>
              <input
                name="password"
                type="password"
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600 ml-1">
              ยืนยันรหัสผ่าน
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-pink-500 transition-colors">
                <Lock size={18} />
              </div>
              <input
                name="confirmPassword"
                type="password"
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Birthday - Full Width */}
          <div className="md:col-span-2 space-y-1">
            <label className="text-sm font-semibold text-gray-600 ml-1">
              วันเกิด
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-pink-500 transition-colors">
                <Calendar size={18} />
              </div>
              <input
                name="birthday"
                type="date"
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Email - Full Width */}
          <div className="md:col-span-2 space-y-1">
            <label className="text-sm font-semibold text-gray-600 ml-1">
              อีเมล
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-pink-500 transition-colors">
                <Mail size={18} />
              </div>
              <input
                name="email"
                type="email"
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 outline-none transition-all"
                placeholder="example@mail.com"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 pt-4">
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-pink-600 to-rose-500 text-white rounded-2xl font-bold shadow-lg shadow-pink-200 hover:shadow-pink-300 hover:translate-y-[-2px] active:translate-y-[0px] transition-all flex items-center justify-center gap-2 group"
            >
              <UserPlus size={20} />
              <span>ลงทะเบียนใช้งาน</span>
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            มีบัญชีอยู่แล้ว?{" "}
            <a
              href="/login"
              className="text-pink-600 font-bold hover:underline"
            >
              เข้าสู่ระบบ
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Register_component;
