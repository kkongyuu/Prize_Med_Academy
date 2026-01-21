import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEvent } from "../function/event";

const HomeFrom = () => {
  const navigate = useNavigate();
  const [dataEvent, setDataEvent] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
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

  const goToSearch = () => {
    navigate("/find_enroll");
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case "published":
        return { label: "เปิดรับสมัคร", style: "bg-[#DFAE25] text-white" };
      case "draft":
        return { label: "เร็วๆ นี้", style: "bg-[#DBBD40] text-white" };
      case "completed":
        return { label: "จบกิจกรรมแล้ว", style: "bg-[#2C2D6D] text-white" };
      case "cancelled":
        return { label: "ยกเลิกกิจกรรม", style: "bg-red-500 text-white" };
      default:
        return { label: "ไม่ระบุสถานะ", style: "bg-gray-400 text-white" };
    }
  };

  // ปรับ Gradient ให้ใช้คู่สี น้ำเงิน-ทอง
  const getGradientColor = (id) => {
    const gradients = [
      "from-[#2C2D6D] to-[#2D3C90]", // Deep Blue
      "from-[#AA832D] to-[#DFAE25]", // Gold
      "from-[#2D3C90] to-[#AA832D]", // Blue to Gold
      "from-[#2C2D6D] to-[#AA832D]", // Deep Blue to Gold
    ];
    return gradients[id % gradients.length];
  };

  const handleCardClick = (form) => {
    if (form.event_status === "published") {
      navigate("/regis_forms", { state: { form } });
    }
  };

  return (
    <section className="min-h-screen bg-[#fcfaf5] py-12 px-4 relative">
      {/* Floating Search Button - ปรับเป็นโทนน้ำเงิน-ทอง */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          onClick={goToSearch}
          className="group flex items-center gap-3 bg-white border-2 border-[#AA832D] text-[#AA832D] hover:bg-[#AA832D] hover:text-white px-6 py-4 rounded-2xl shadow-2xl transition-all duration-300 transform hover:-translate-y-2 active:scale-95"
        >
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
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <span className="font-bold">เช็คสถานะการสมัคร</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          {/* Header สีทอง Gradient */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#AA832D] via-[#DFAE25] to-[#AA832D] mb-3 uppercase tracking-widest">
            Prize Med Academy
          </h1>
          <div className="h-1 w-24 bg-[#DFAE25] mx-auto mb-4 rounded-full"></div>
          <h2 className="text-xl text-[#2C2D6D] mb-4 font-semibold">
            โครงการอบรมและสัมมนา
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8 font-light">
            ระบบแพลตฟอร์มเพื่อบริหารจัดการงานด้านสุขภาพและบุคลากรการแพทย์
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dataEvent.length > 0 ? (
            dataEvent.map((form) => {
              const statusInfo = getStatusDisplay(form.event_status);
              const isPublished = form.event_status === "published";
              const priceDisplay =
                form.event_fee > 0
                  ? `${Number(form.event_fee).toLocaleString()} บาท`
                  : "ฟรีไม่มีค่าใช้จ่าย";

              return (
                <div
                  key={form.id}
                  onClick={() => handleCardClick(form)}
                  className={`group bg-white rounded-2xl shadow-sm border border-[#DBBD40]/20 overflow-hidden transition-all duration-300 transform 
                    hover:scale-[1.03] hover:shadow-xl 
                    ${isPublished ? "cursor-pointer" : "cursor-default grayscale-[0.3] opacity-90"}`}
                >
                  {/* Card Header ด้วย Gradient ใหม่ */}
                  <div
                    className={`h-40 bg-gradient-to-br ${getGradientColor(form.id)} relative`}
                  >
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                    <div className="absolute top-4 left-4">
                      <span
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold shadow-md uppercase tracking-wider ${statusInfo.style}`}
                      >
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl text-[#2C2D6D] font-bold mb-4 line-clamp-2 min-h-[3.5rem] leading-snug group-hover:text-[#AA832D] transition-colors">
                      {form.event_name}
                    </h3>

                    <div className="space-y-4 mb-6">
                      {/* Organizer */}
                      <div className="flex items-center text-gray-600 text-sm">
                        <div className="w-8 h-8 rounded-full bg-[#f5f0e1] flex items-center justify-center mr-3">
                          <svg
                            className="w-4 h-4 text-[#AA832D]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                        </div>
                        <span className="font-medium truncate">
                          {form.organizer_name}
                        </span>
                      </div>

                      {/* Date */}
                      <div className="flex items-center text-gray-600 text-sm">
                        <div className="w-8 h-8 rounded-full bg-[#e8e9f2] flex items-center justify-center mr-3">
                          <svg
                            className="w-4 h-4 text-[#2C2D6D]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <span className="font-medium">
                          {form.event_date || "Coming Soon"}
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center text-gray-600 text-sm">
                        <div className="w-8 h-8 rounded-full bg-[#fdf8e6] flex items-center justify-center mr-3">
                          <svg
                            className="w-4 h-4 text-[#DFAE25]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <span
                          className={`font-bold ${form.event_fee > 0 ? "text-[#2C2D6D]" : "text-green-600"}`}
                        >
                          {priceDisplay}
                        </span>
                      </div>
                    </div>

                    {isPublished && (
                      <div className="pt-4 border-t border-gray-100 flex justify-end">
                        <span className="text-[#AA832D] font-bold text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                          ลงทะเบียนเลย
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full flex flex-col items-center py-20 bg-white rounded-3xl border-2 border-dashed border-[#DBBD40]/30">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#AA832D] mb-4"></div>
              <p className="text-gray-400 font-medium">
                กำลังเตรียมข้อมูลกิจกรรม...
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HomeFrom;
