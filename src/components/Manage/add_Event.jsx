import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../../function/event";
import Swal from "sweetalert2";

function Add_Event() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    event_name: "",
    organizer_name: "",
    event_description: "",
    event_date: "",
    event_meeting: "",
    event_fee: "",
    event_status: "draft",
    image_url: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEvent(formData);
      Swal.fire({
        icon: "success",
        title: "สร้างกิจกรรมสำเร็จ",
        text: "ข้อมูลกิจกรรมถูกบันทึกเรียบร้อยแล้ว",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate("/manage");
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถสร้างกิจกรรมได้ โปรดลองอีกครั้ง",
        confirmButtonColor: "#2C2D6D",
      });
    }
  };

  // สไตล์มาตรฐานสำหรับ Label และ Input
  const labelStyle = "block text-sm font-bold text-[#2C2D6D] mb-1.5 ml-1";
  const inputStyle =
    "w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#DBBD40] focus:border-[#AA832D] outline-none transition-all bg-white shadow-sm placeholder:text-gray-300";

  return (
    <section className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-2xl shadow-indigo-900/10 rounded-[2rem] overflow-hidden border border-gray-50">
        {/* Header - Navy & Gold Theme */}
        <div className="bg-[#2C2D6D] py-8 px-10 border-b-4 border-[#AA832D]">
          <h2 className="text-3xl font-black text-white tracking-tight">
            เพิ่ม <span className="text-[#DFAE25]">โครงการใหม่</span>
          </h2>
          <p className="text-indigo-200 text-sm mt-1 font-medium italic">
            Create a new professional training event
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-10 grid grid-cols-1 md:grid-cols-2 gap-7"
        >
          {/* ชื่อกิจกรรม */}
          <div className="md:col-span-2">
            <label className={labelStyle}>ชื่อโครงการอบรม *</label>
            <input
              required
              type="text"
              name="event_name"
              value={formData.event_name}
              onChange={handleChange}
              placeholder="เช่น โครงการอบรมภาษาอังกฤษเพื่อการสื่อสาร"
              className={inputStyle}
            />
          </div>

          {/* ผู้จัดงาน */}
          <div>
            <label className={labelStyle}>ชื่อผู้จัดงาน *</label>
            <input
              required
              type="text"
              name="organizer_name"
              value={formData.organizer_name}
              onChange={handleChange}
              placeholder="ชื่อฝ่ายหรือหน่วยงาน"
              className={inputStyle}
            />
          </div>

          {/* สถานะ */}
          <div>
            <label className={labelStyle}>สถานะกิจกรรม</label>
            <select
              name="event_status"
              value={formData.event_status}
              onChange={handleChange}
              className={`${inputStyle} cursor-pointer`}
            >
              <option value="draft">Draft (ฉบับร่าง)</option>
              <option value="published">Published (เปิดรับสมัคร)</option>
              <option value="cancelled">Cancelled (ยกเลิก)</option>
              <option value="completed">Completed (จบกิจกรรม)</option>
            </select>
          </div>

          {/* วันที่จัดงาน */}
          <div>
            <label className={labelStyle}>วันที่จัดงาน</label>
            <input
              type="text"
              name="event_date"
              value={formData.event_date}
              onChange={handleChange}
              placeholder="เช่น 20-21 มีนาคม 2568"
              className={inputStyle}
            />
          </div>

          {/* ค่าธรรมเนียม */}
          <div>
            <label className={labelStyle}>ค่าธรรมเนียม (บาท)</label>
            <input
              type="text"
              name="event_fee"
              value={formData.event_fee}
              onChange={handleChange}
              placeholder="เช่น 2,500"
              className={inputStyle}
            />
          </div>

          {/* สถานที่/ลิงก์ประชุม */}
          <div className="md:col-span-2">
            <label className={labelStyle}>
              สถานที่ หรือ ลิงก์ช่องทางเข้าอบรม
            </label>
            <input
              type="text"
              name="event_meeting"
              value={formData.event_meeting}
              onChange={handleChange}
              placeholder="ระบุสถานที่จัดงาน หรือ ลิงก์ Zoom/Google Meet"
              className={inputStyle}
            />
          </div>

          {/* รูปภาพ URL & ปุ่มอัปโหลด */}
          <div className="flex gap-2">
            <div className="relative flex-grow">
              <input
                type="text"
                name="image_url"
                // ถ้า image_url เป็น Object (ไฟล์) ให้โชว์ชื่อไฟล์ ถ้าเป็น string ให้โชว์ url
                value={
                  typeof formData.image_url === "string"
                    ? formData.image_url
                    : formData.image_url.name
                }
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none transition"
              />
              {/* ปุ่มกากบาทล้างค่า (จะโชว์เมื่อมีข้อมูล) */}
              {formData.image_url && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, image_url: "" })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* ปุ่มอัปโหลดรูปภาพเล็กๆ ด้านขวา */}
            <label className="flex items-center justify-center px-4 py-2 bg-pink-50 text-pink-600 border border-pink-200 rounded-lg cursor-pointer hover:bg-pink-100 transition-colors shrink-0">
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-sm font-medium">เลือกไฟล์</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setFormData({ ...formData, image_url: file });
                  }
                }}
              />
            </label>
          </div>

          {/* รายละเอียดกิจกรรม */}
          <div className="md:col-span-2">
            <label className={labelStyle}>รายละเอียดกิจกรรม</label>
            <textarea
              name="event_description"
              rows="4"
              value={formData.event_description}
              onChange={handleChange}
              placeholder="ระบุรายละเอียดเพิ่มเติมเกี่ยวกับหลักสูตร..."
              className={`${inputStyle} resize-none`}
            ></textarea>
          </div>

          {/* ปุ่ม Action */}
          <div className="md:col-span-2 flex items-center justify-end gap-4 pt-8 border-t border-gray-100 mt-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-8 py-3 bg-gray-100 text-gray-500 rounded-2xl hover:bg-gray-200 font-bold transition-all"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-12 py-3 bg-gradient-to-r from-[#2C2D6D] to-[#2D3C90] text-white font-black rounded-2xl hover:shadow-xl hover:shadow-indigo-900/20 transition-all transform hover:-translate-y-1 active:scale-95 shadow-lg shadow-indigo-200/50"
            >
              บันทึกกิจกรรม
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Add_Event;
