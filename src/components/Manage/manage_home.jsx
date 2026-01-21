import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getEvent,
  deleteEvent,
  refreshAccessToken,
} from "../../function/event";
import Swal from "sweetalert2";

function Manage_home() {
  const navigate = useNavigate();
  const [dataEvent, setDataEvent] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        await refreshAccessToken();
        const events = await getEvent();
        if (events.success && events.data) {
          setDataEvent(events.data);
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = dataEvent.filter((event) =>
    event.event_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAddEvent = () => navigate("/manage/add_event");
  const handleUpdateEvent = (items) =>
    navigate("/manage/update_event", { state: { items } });
  const handleViewEnrollments = (items) =>
    navigate("/manage/manage_enrollment", { state: { items } });

  const handleDeleteEvent = (id) => {
    Swal.fire({
      title: "ยืนยันการลบข้อมูล?",
      text: "คุณจะไม่สามารถกู้คืนข้อมูลกิจกรรมนี้ได้!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2C2D6D", // ใช้สีน้ำเงินหลัก
      cancelButtonColor: "#6b7280",
      confirmButtonText: "ใช่, ลบเลย!",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteEvent(id);
          Swal.fire({
            title: "ลบสำเร็จ!",
            text: "ข้อมูลกิจกรรมถูกลบออกจากระบบแล้ว",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
          window.location.reload();
        } catch (error) {
          Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถลบข้อมูลได้", "error");
        }
      }
    });
  };

  const getStatusBadge = (status) => {
    const s = status?.toString().toLowerCase().trim();
    // ปรับสี Badge ให้เข้ากับธีมน้ำเงิน-ทอง
    const baseClass =
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border shadow-sm";

    switch (s) {
      case "active":
      case "เปิด":
        return (
          <span
            className={`${baseClass} bg-emerald-50 text-emerald-700 border-emerald-200`}
          >
            <span className="w-2 h-2 mr-2 rounded-full bg-emerald-500 animate-pulse"></span>
            กำลังดำเนินการ
          </span>
        );
      case "closed":
      case "ปิด":
        return (
          <span
            className={`${baseClass} bg-gray-50 text-gray-600 border-gray-200`}
          >
            <span className="w-2 h-2 mr-2 rounded-full bg-gray-400"></span>
            ปิดโครงการ
          </span>
        );
      default:
        return (
          <span
            className={`${baseClass} bg-[#F9F7F2] text-[#AA832D] border-[#DBBD40]/30`}
          >
            {status || "ไม่ระบุสถานะ"}
          </span>
        );
    }
  };

  return (
    <section className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black text-[#2C2D6D] tracking-tight">
              การจัดการ <span className="text-[#AA832D]">โครงการ</span>
            </h1>
            <div className="h-1.5 w-20 bg-[#DFAE25] mt-2 rounded-full"></div>
            <p className="text-gray-500 mt-3 font-medium text-lg">
              ระบบบริหารจัดการข้อมูลโครงการและตรวจสอบรายชื่อ
            </p>
          </div>

          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="ค้นหาชื่อโครงการ..."
              className="block w-full pl-12 pr-4 py-3 text-lg border border-gray-300 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-pink-500 focus:outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute left-4 top-3.5 text-xl text-gray-400">
              🔍
            </span>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-[1200px] w-full border-collapse">
              <thead>
                <tr className="bg-[#2C2D6D] text-white">
                  <th className="px-6 py-6 text-left text-sm font-bold uppercase tracking-wider border-b border-white/10 text-[#DFAE25]">
                    สถานะ
                  </th>
                  <th className="px-6 py-6 text-left text-sm font-bold uppercase tracking-wider border-b border-white/10">
                    รายละเอียดโครงการ
                  </th>
                  <th className="px-6 py-6 text-left text-sm font-bold uppercase tracking-wider border-b border-white/10">
                    ผู้จัดงาน
                  </th>
                  <th className="px-6 py-6 text-left text-sm font-bold uppercase tracking-wider border-b border-white/10">
                    กำหนดการ
                  </th>
                  <th className="px-6 py-6 text-center text-sm font-bold uppercase tracking-wider border-b border-white/10">
                    ค่าธรรมเนียม
                  </th>
                  <th className="px-6 py-6 text-center text-sm font-bold uppercase tracking-wider border-b border-white/10 text-[#DFAE25]">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEvents.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[#F9F7F2]/50 transition-colors group"
                  >
                    <td className="px-6 py-8">
                      {getStatusBadge(item.event_status)}
                    </td>
                    <td className="px-6 py-8">
                      <div className="text-xs font-bold text-[#AA832D] mb-1 px-2 py-0.5 bg-[#AA832D]/5 rounded w-fit italic">
                        #{item.event_id}
                      </div>
                      <div className="text-lg font-extrabold text-[#2C2D6D] group-hover:text-[#2D3C90] transition-colors">
                        {item.event_name}
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                        <span className="text-indigo-500 font-bold">📍</span>
                        {item.event_meeting}
                      </div>
                    </td>
                    <td className="px-6 py-8">
                      <span className="text-base font-semibold text-gray-700">
                        {item.organizer_name}
                      </span>
                    </td>
                    <td className="px-6 py-8">
                      <div className="flex flex-col gap-1">
                        <div className="text-sm font-bold text-gray-800 flex items-center gap-2">
                          <span className="text-[#DFAE25]">🗓️</span>{" "}
                          {item.event_date}
                        </div>
                        <div className="text-[11px] text-gray-400 font-medium uppercase tracking-tighter">
                          Created:{" "}
                          {new Date(item.createdAt).toLocaleDateString("th-TH")}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-8 text-center">
                      {item.event_fee === "0.00" ? (
                        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg font-black text-sm">
                          FREE
                        </span>
                      ) : (
                        <div className="text-lg font-black text-[#2C2D6D]">
                          {Number(item.event_fee).toLocaleString()}{" "}
                          <span className="text-xs font-bold">฿</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-8">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleViewEnrollments(item)}
                          className="bg-white border border-gray-200 text-[#2C2D6D] hover:bg-[#2C2D6D] hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm"
                        >
                          👥 สมาชิก
                        </button>
                        <button
                          onClick={() => handleUpdateEvent(item)}
                          className="bg-white border border-gray-200 text-[#AA832D] hover:bg-[#AA832D] hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm"
                        >
                          ⚙️ แก้ไข
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(item.event_id)}
                          className="bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm"
                        >
                          🗑️ ลบ
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Floating Add Button */}
        <div className="fixed bottom-12 right-12 group">
          <button
            onClick={handleAddEvent}
            className="flex items-center gap-4 bg-gradient-to-r from-[#2C2D6D] to-[#2D3C90] text-[#DFAE25] px-8 py-5 rounded-2xl shadow-[0_15px_40px_rgba(44,45,109,0.3)] transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 active:scale-95 border-b-4 border-[#1c1d45]"
          >
            <div className="bg-[#DFAE25] text-[#2C2D6D] p-1.5 rounded-lg group-hover:rotate-180 transition-transform duration-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={4}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <span className="text-xl font-black tracking-tight">
              สร้างโครงการใหม่
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

export default Manage_home;
