import { useState } from "react";
import { findEnrollmentByPhone } from "../../function/enrollment";
import Swal from "sweetalert2";

function FindEnrollment() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({ active: [], history: [] });
  const [hasSearched, setHasSearched] = useState(false);
  const [viewStatus, setViewStatus] = useState("active");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (phone.length < 10) {
      return Swal.fire({
        title: "แจ้งเตือน",
        text: "กรุณากรอกเบอร์โทรศัพท์ 10 หลัก",
        icon: "warning",
        confirmButtonColor: "#2C2D6D", // เปลี่ยนเป็นสีน้ำเงินเข้ม
      });
    }

    setLoading(true);
    try {
      const res = await findEnrollmentByPhone({ phone: phone });
      if (res.success && res.data.findAll) {
        const allData = res.data.findAll;
        const activeRaw = allData.filter(
          (item) => item.eventDetails?.event_status === "published",
        );
        const historyRaw = allData.filter((item) =>
          ["completed", "cancelled"].includes(item.eventDetails?.event_status),
        );

        const formatForUI = (list) =>
          list.map((item) => ({
            event: {
              event_name: item.eventDetails?.event_name,
              event_date: item.eventDetails?.event_date,
              event_status: item.eventDetails?.event_status,
            },
            enrollment: {
              fullname: `${item.prefix}${item.fullname}`,
              phone: item.phone,
              payment_status: item.payment_status,
              enrollmentAT: item.enrollmentAT,
              remark: item.remark,
            },
          }));

        setResults({
          active: formatForUI(activeRaw),
          history: formatForUI(historyRaw),
        });
        setHasSearched(true);
      } else {
        setResults({ active: [], history: [] });
        Swal.fire({
          title: "ไม่พบข้อมูล",
          icon: "info",
          confirmButtonColor: "#2C2D6D",
        });
      }
    } catch (err) {
      Swal.fire({
        title: "ข้อผิดพลาด",
        text: "ไม่สามารถดึงข้อมูลได้",
        icon: "error",
        confirmButtonColor: "#2C2D6D",
      });
    } finally {
      setLoading(false);
    }
  };

  // สไตล์สำหรับสถานะการชำระเงิน - ปรับตามชุดสีใหม่
  const getPaymentStatusStyle = (status) => {
    switch (status) {
      case "confirmed":
        return "text-emerald-700 bg-emerald-50 border-emerald-200";
      case "pending":
        return "text-[#AA832D] bg-[#fdf8e6] border-[#DBBD40]/30";
      case "rejected":
        return "text-rose-600 bg-rose-50 border-rose-100";
      default:
        return "text-slate-500 bg-slate-50 border-slate-100";
    }
  };

  // สไตล์สำหรับสถานะโครงการ - ปรับตามชุดสีใหม่
  const getEventStatusStyle = (status) => {
    switch (status) {
      case "published":
        return "text-[#2C2D6D] bg-[#e8e9f2] border-[#2C2D6D]/20";
      case "completed":
        return "text-slate-600 bg-slate-100 border-slate-200";
      case "cancelled":
        return "text-rose-600 bg-rose-50 border-rose-100";
      default:
        return "text-slate-500 bg-slate-50 border-slate-100";
    }
  };

  const translateEventStatus = (status) => {
    switch (status) {
      case "published":
        return "กำลังเปิดรับ";
      case "completed":
        return "จบโครงการ";
      case "cancelled":
        return "ยกเลิก";
      default:
        return status;
    }
  };

  return (
    <section className="min-h-screen bg-[#FCFAf5] py-12 px-4 font-sans antialiased text-slate-600">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[#2C2D6D] mb-2">
            ตรวจสอบข้อมูลการลงทะเบียน
          </h1>
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-10 bg-[#AA832D]/30"></span>
            <h2 className="text-sm font-bold text-[#AA832D] uppercase tracking-widest">
              Prize Med Academy
            </h2>
            <span className="h-px w-10 bg-[#AA832D]/30"></span>
          </div>
          <p className="text-slate-500 max-w-md mx-auto text-sm leading-relaxed">
            ระบุเบอร์โทรศัพท์เพื่อเรียกดูสถานะโครงการและประวัติการเรียนของคุณ
          </p>
        </div>

        {/* Search Bar - ปรับสีเส้นขอบและปุ่ม */}
        <div className="mb-10">
          <form onSubmit={handleSearch} className="relative group">
            <input
              type="text"
              placeholder="ค้นหาด้วยเบอร์โทรศัพท์"
              className="w-full pl-6 pr-28 py-4 bg-white rounded-2xl border border-[#DBBD40]/40 focus:border-[#AA832D] focus:ring-4 focus:ring-[#AA832D]/5 text-sm transition-all outline-none shadow-sm placeholder:text-slate-300"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              maxLength={10}
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-2 bottom-2 px-8 bg-[#2C2D6D] hover:bg-[#2D3C90] text-white text-xs font-bold rounded-xl transition-all active:scale-95 disabled:opacity-50 shadow-md"
            >
              {loading ? "..." : "ค้นหาข้อมูล"}
            </button>
          </form>
        </div>

        {hasSearched && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Tabs Navigation */}
            <div className="flex gap-10 border-b border-slate-200 px-4">
              {["active", "history"].map((type) => (
                <button
                  key={type}
                  onClick={() => setViewStatus(type)}
                  className={`pb-4 text-[13px] font-bold transition-all relative ${
                    viewStatus === type
                      ? "text-[#2C2D6D]"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {type === "active" ? "รายการปัจจุบัน" : "ประวัติการอบรม"}
                  <span className="ml-1 opacity-60">
                    ({results[type].length})
                  </span>
                  {viewStatus === type && (
                    <div className="absolute bottom-[-1px] left-0 w-full h-[3px] bg-[#AA832D] rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Content Cards */}
            <div className="space-y-5">
              {(viewStatus === "active" ? results.active : results.history)
                .length > 0 ? (
                (viewStatus === "active"
                  ? results.active
                  : results.history
                ).map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-[#DBBD40]/20 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Card Header */}
                    <div className="px-6 py-4 bg-[#fcfcfc] border-b border-slate-50 flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border uppercase tracking-wider ${getEventStatusStyle(item.event?.event_status)}`}
                        >
                          {translateEventStatus(item.event?.event_status)}
                        </span>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="text-[11px] font-medium">
                            {item.event?.event_date}
                          </span>
                        </div>
                      </div>
                      <h3 className="text-[15px] font-bold text-[#2C2D6D] leading-snug">
                        {item.event?.event_name}
                      </h3>
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                        <div className="space-y-4">
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase text-slate-400 font-bold tracking-widest mb-1">
                              ชื่อ-นามสกุล ผู้ลงทะเบียน
                            </span>
                            <span className="text-[14px] font-semibold text-[#2C2D6D]">
                              {item.enrollment?.fullname}
                            </span>
                          </div>

                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase text-slate-400 font-bold tracking-widest mb-1">
                              สถานะการชำระเงิน
                            </span>
                            <div>
                              <span
                                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-bold border ${getPaymentStatusStyle(item.enrollment?.payment_status)}`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${item.enrollment?.payment_status === "confirmed" ? "bg-emerald-500" : "bg-current"}`}
                                ></span>
                                {item.enrollment?.payment_status === "rejected"
                                  ? "ถูกปฏิเสธ"
                                  : item.enrollment?.payment_status ===
                                      "confirmed"
                                    ? "ชำระเงินเรียบร้อย"
                                    : "รอตรวจสอบข้อมูล"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="md:text-right">
                          <p className="text-[11px] text-slate-400 mb-1">
                            วันที่สมัครเข้าร่วม
                          </p>
                          <span className="text-[13px] text-[#AA832D] font-bold">
                            {item.enrollment?.enrollmentAT
                              ? new Date(
                                  item.enrollment.enrollmentAT,
                                ).toLocaleDateString("th-TH", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })
                              : "-"}
                          </span>
                        </div>
                      </div>

                      {/* Remark Section - เมื่อถูกปฏิเสธ */}
                      {item.enrollment?.payment_status === "rejected" &&
                        item.enrollment?.remark && (
                          <div className="mt-5 p-4 bg-rose-50 rounded-2xl border border-rose-100 flex gap-3">
                            <div className="text-rose-500">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-[11px] font-bold text-rose-800 uppercase tracking-tight mb-0.5">
                                สาเหตุที่ข้อมูลไม่ผ่านการอนุมัติ
                              </p>
                              <p className="text-xs text-rose-600 font-medium">
                                "{item.enrollment.remark}"
                              </p>
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100">
                  <p className="text-slate-300 text-sm font-medium italic">
                    ไม่พบข้อมูลประวัติการลงทะเบียนในระบบ
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default FindEnrollment;
