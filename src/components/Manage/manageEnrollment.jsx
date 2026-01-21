import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  manageEnrollments,
  updateEnrollmentStatus,
} from "../../function/event";
import Swal from "sweetalert2";

function ManageEnrollments() {
  const location = useLocation();
  const navigate = useNavigate();
  const { items } = location.state || {};

  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(null);

  useEffect(() => {
    if (!items?.event_id) {
      Swal.fire("ข้อผิดพลาด", "ไม่พบข้อมูลโครงการ", "error");
      navigate(-1);
      return;
    }
    fetchData();
  }, [items]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await manageEnrollments(items.event_id);
      if (res.data.success) {
        setEnrollments(res.data.data);
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "โหลดข้อมูลไม่สำเร็จ", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (enrollmentId, newStatus) => {
    try {
      let rejectionReason = "";

      if (newStatus === "rejected") {
        const { value: text, isConfirmed } = await Swal.fire({
          title: "ระบุเหตุผลที่ปฏิเสธ",
          input: "textarea",
          inputPlaceholder: "เช่น รูปสลิปไม่ชัดเจน, ยอดเงินไม่ถูกต้อง...",
          showCancelButton: true,
          confirmButtonColor: "#2C2D6D", // เปลี่ยนเป็นสีธีมหลัก
          confirmButtonText: "ยืนยันการปฏิเสธ",
          cancelButtonText: "ยกเลิก",
          inputValidator: (value) => {
            if (!value) return "กรุณากรอกเหตุผลก่อนยืนยัน";
          },
        });
        if (!isConfirmed) return;
        rejectionReason = text;
      } else {
        const result = await Swal.fire({
          title: `ยืนยันการเปลี่ยนสถานะ?`,
          text: `คุณต้องการปรับสถานะเป็น "${newStatus === "confirmed" ? "อนุมัติแล้ว" : "รอตรวจสอบ"}"`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#2C2D6D",
          cancelButtonColor: "#AA832D",
          confirmButtonText: "ยืนยัน",
          cancelButtonText: "ยกเลิก",
        });
        if (!result.isConfirmed) return;
      }

      const res = await updateEnrollmentStatus({
        enrollment_id: enrollmentId,
        payment_status: newStatus,
        remark: rejectionReason,
      });

      if (res.data.success) {
        Swal.fire({
          title: "สำเร็จ!",
          text: "อัปเดตสถานะเรียบร้อยแล้ว",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        fetchData();
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "ไม่สามารถอัปเดตสถานะได้", "error");
    }
  };

  const renderStatusSelector = (row) => {
    const statusStyles = {
      pending:
        "bg-[#F9F7F2] text-[#AA832D] border-[#DBBD40]/30 focus:ring-[#AA832D]/20",
      confirmed:
        "bg-emerald-50 text-emerald-700 border-emerald-200 focus:ring-emerald-500/20",
      rejected:
        "bg-rose-50 text-rose-700 border-rose-200 focus:ring-rose-500/20",
    };

    return (
      <div className="flex flex-col items-center gap-2">
        <div className="relative inline-block w-full max-w-[150px]">
          <select
            value={row.payment_status}
            onChange={(e) =>
              handleStatusChange(row.enrollment_id, e.target.value)
            }
            className={`appearance-none w-full px-4 py-2 pr-10 rounded-xl border text-[12px] font-bold cursor-pointer transition-all outline-none focus:ring-4 shadow-sm ${
              statusStyles[row.payment_status] || statusStyles.pending
            }`}
          >
            <option value="pending">🕒 รอตรวจสอบ</option>
            <option value="confirmed">✅ อนุมัติแล้ว</option>
            <option value="rejected">❌ ปฏิเสธ</option>
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none opacity-60">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        {row.payment_status === "rejected" && row.remark && (
          <div
            className="text-[10px] text-rose-500 font-medium max-w-[140px] truncate italic"
            title={row.remark}
          >
            เหตุผล: {row.remark}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 md:p-10 bg-[#F8FAFC] min-h-screen font-sans">
      {/* Modal View Image */}
      {selectedImg && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2C2D6D]/90 p-4 backdrop-blur-md"
          onClick={() => setSelectedImg(null)}
        >
          <div className="relative max-w-4xl w-full flex justify-center">
            <button className="absolute -top-12 right-0 text-white hover:text-[#DFAE25] font-black text-lg transition-colors">
              ปิดหน้าต่าง [X]
            </button>
            <img
              src={selectedImg}
              alt="Slip Full"
              className="max-h-[85vh] rounded-2xl shadow-2xl object-contain border-4 border-white/10"
            />
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-[2rem] p-8 mb-8 shadow-xl shadow-slate-200/60 border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-black text-[#2C2D6D] tracking-tight">
              {items?.event_name}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-3">
              <span className="bg-[#2C2D6D] text-white px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
                ID: {items?.event_id}
              </span>
              <span className="bg-[#F9F7F2] text-[#AA832D] border border-[#DBBD40]/20 px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
                🗓️ {items?.event_date}
              </span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#2C2D6D] to-[#2D3C90] px-10 py-4 rounded-3xl shadow-2xl shadow-indigo-900/20 border-b-4 border-[#1c1d45]">
            <p className="text-[#DFAE25] text-xs font-black uppercase tracking-[0.2em] text-center mb-1">
              ผู้สมัครทั้งหมด
            </p>
            <p className="text-white text-3xl font-black text-center">
              {enrollments.length}{" "}
              <span className="text-sm font-light text-indigo-200">ราย</span>
            </p>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#2C2D6D]">
                  <th className="px-8 py-6 text-[12px] font-bold text-indigo-100 uppercase tracking-[0.15em]">
                    ข้อมูลการสมัคร
                  </th>
                  <th className="px-8 py-6 text-[12px] font-bold text-indigo-100 uppercase tracking-[0.15em]">
                    รายชื่อผู้สมัคร
                  </th>
                  <th className="px-8 py-6 text-[12px] font-bold text-indigo-100 uppercase tracking-[0.15em] text-center">
                    หลักฐานการเงิน
                  </th>
                  <th className="px-8 py-6 text-[12px] font-bold text-indigo-100 uppercase tracking-[0.15em] text-center">
                    สถานะสิทธิ์
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-24">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-[#AA832D] border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-slate-400 font-bold italic">
                          กำลังดึงข้อมูลผู้เข้าร่วม...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  enrollments.map((row) => (
                    <tr
                      key={row.enrollment_id}
                      className="hover:bg-[#F9F7F2]/40 transition-all group"
                    >
                      <td className="px-8 py-6">
                        <div className="text-sm font-black text-[#2C2D6D]">
                          #{row.enrollment_id}
                        </div>
                        <div className="text-[11px] text-slate-400 font-medium mt-1">
                          ลงทะเบียน:{" "}
                          {new Date(row.enrollmentAT).toLocaleDateString(
                            "th-TH",
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-base font-bold text-slate-800">{`${row.prefix} ${row.fullname}`}</div>
                        <div className="flex gap-2 mt-1">
                          <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">
                            📞 {row.phone}
                          </span>
                          <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">
                            ✉️ {row.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-center">
                          {row.slip_url ? (
                            <div
                              className="relative w-20 h-24 bg-slate-200 rounded-2xl overflow-hidden border-4 border-white shadow-lg cursor-pointer hover:scale-110 hover:rotate-2 transition-all duration-300 group/slip"
                              onClick={() => setSelectedImg(row.slip_url)}
                            >
                              <img
                                src={row.slip_url}
                                alt="slip"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-[#2C2D6D]/40 opacity-0 group-hover/slip:opacity-100 flex items-center justify-center transition-opacity">
                                <span className="text-white text-[10px] font-bold">
                                  ขยายรูป
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="w-20 h-24 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center grayscale opacity-50">
                              <span className="text-[10px] text-slate-400 font-bold tracking-tighter">
                                NO SLIP
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        {renderStatusSelector(row)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageEnrollments;
