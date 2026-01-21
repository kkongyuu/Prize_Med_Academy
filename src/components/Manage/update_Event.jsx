import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { updateEvent } from "../../function/event";
import Swal from "sweetalert2";

function Update_Event() {
  const navigate = useNavigate();
  const location = useLocation(); // ใช้สำหรับรับ state ที่ส่งมาจาก navigate
  const { items } = location.state || {}; // ดึงข้อมูล items ที่ส่งมาจากหน้าตาราง

  // กำหนด State โดยใช้ข้อมูลจาก items ถ้าไม่มีให้เป็นค่าว่าง
  const [formData, setFormData] = useState({
    event_name: items?.event_name || "",
    organizer_name: items?.organizer_name || "",
    event_description: items?.event_description || "",
    event_date: items?.event_date || "",
    event_meeting: items?.event_meeting || "",
    event_fee: items?.event_fee || "",
    event_status: items?.event_status || "draft",
    image_url: items?.image_url || "",
  });

  // ตรวจสอบว่าถ้าไม่มีข้อมูล items (เช่น ผู้ใช้รีเฟรชหน้า หรือเข้า URL ตรงๆ) ให้ดีดกลับไปหน้าเดิม
  useEffect(() => {
    if (!items) {
      Swal.fire("ไม่พบข้อมูล", "กรุณาเลือกกิจกรรมที่ต้องการแก้ไขใหม่", "error");
      navigate(-1);
    }
  }, [items, navigate]);

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
      // เรียกใช้ updateEvent โดยส่ง ID ของกิจกรรมไปด้วย
      await updateEvent(items.event_id, formData);

      Swal.fire({
        icon: "success",
        title: "อัปเดตกิจกรรมสำเร็จ",
        text: "ข้อมูลถูกแก้ไขเรียบร้อยแล้ว",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate(-1); // บันทึกเสร็จกลับไปหน้าก่อนหน้า (หน้าตาราง)
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถอัปเดตข้อมูลได้",
      });
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#DBBD40] focus:border-[#AA832D] outline-none transition-all bg-white shadow-sm";
  const labelClass = "block text-sm font-bold text-[#2C2D6D] mb-1.5 ml-1";

  return (
    <section className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-2xl shadow-indigo-900/10 rounded-[2rem] overflow-hidden border border-gray-100">
        {/* Header - Navy Blue & Gold */}
        <div className="bg-[#2C2D6D] py-8 px-10 border-b-4 border-[#AA832D]">
          <h2 className="text-3xl font-black text-white tracking-tight">
            แก้ไข <span className="text-[#DFAE25]">โครงการ</span>
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="bg-[#AA832D] text-white text-[10px] font-bold px-2 py-0.5 rounded">
              ID: {items?.event_id}
            </span>
            <p className="text-indigo-200 text-sm font-medium">
              Update event information
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-10 grid grid-cols-1 md:grid-cols-2 gap-7"
        >
          {/* ชื่อกิจกรรม */}
          <div className="md:col-span-2">
            <label className={labelClass}>ชื่อโครงการอบรม *</label>
            <input
              required
              type="text"
              name="event_name"
              value={formData.event_name}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* ผู้จัดงาน */}
          <div>
            <label className={labelClass}>ชื่อผู้จัดงาน *</label>
            <input
              required
              type="text"
              name="organizer_name"
              value={formData.organizer_name}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* สถานะ */}
          <div>
            <label className={labelClass}>สถานะกิจกรรม</label>
            <select
              name="event_status"
              value={formData.event_status}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="draft">Draft (เร็วๆ นี้)</option>
              <option value="published">Published (เปิดรับสมัคร)</option>
              <option value="cancelled">Cancelled (ยกเลิก)</option>
              <option value="completed">Completed (จบกิจกรรม)</option>
            </select>
          </div>

          {/* วันที่จัดงาน */}
          <div>
            <label className={labelClass}>วันที่จัดงาน</label>
            <input
              type="text"
              name="event_date"
              value={formData.event_date}
              onChange={handleChange}
              placeholder="เช่น 25 มกราคม 2567"
              className={inputClass}
            />
          </div>

          {/* ค่าธรรมเนียม */}
          <div>
            <label className={labelClass}>ค่าธรรมเนียม (บาท)</label>
            <input
              type="text"
              name="event_fee"
              value={formData.event_fee}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* สถานที่ */}
          <div className="md:col-span-2">
            <label className={labelClass}>สถานที่ / ช่องทางออนไลน์</label>
            <input
              type="text"
              name="event_meeting"
              value={formData.event_meeting}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* รูปภาพ */}
          <div className="md:col-span-2">
            <label className={labelClass}>รูปหน้าปกกิจกรรม</label>
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                name="image_url"
                value={
                  typeof formData.image_url === "string"
                    ? formData.image_url
                    : formData.image_url.name
                }
                onChange={handleChange}
                className={inputClass}
                placeholder="URL รูปภาพ หรือเลือกไฟล์"
              />
              <label className="px-5 py-2.5 bg-[#F9F7F2] text-[#AA832D] border border-[#AA832D]/30 rounded-xl cursor-pointer hover:bg-[#AA832D] hover:text-white transition shadow-sm font-bold shrink-0 flex items-center">
                เลือกไฟล์
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    setFormData({ ...formData, image_url: e.target.files[0] })
                  }
                />
              </label>
            </div>

            {/* Preview Image */}
            {formData.image_url && (
              <div className="flex items-center gap-5 p-4 bg-[#F9F7F2] rounded-2xl border border-[#DBBD40]/20 shadow-inner">
                <img
                  src={
                    typeof formData.image_url === "string"
                      ? formData.image_url
                      : URL.createObjectURL(formData.image_url)
                  }
                  alt="Current"
                  className="h-20 w-20 object-cover rounded-xl shadow-md border-2 border-white"
                />
                <div>
                  <p className="text-xs font-black text-[#AA832D] uppercase tracking-wider">
                    Image Preview
                  </p>
                  <p className="text-xs text-gray-500 mt-1 font-medium">
                    ภาพหน้าปกที่กำลังจะถูกบันทึก
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* รายละเอียด */}
          <div className="md:col-span-2">
            <label className={labelClass}>รายละเอียดกิจกรรม</label>
            <textarea
              name="event_description"
              rows="4"
              value={formData.event_description}
              onChange={handleChange}
              className={`${inputClass} resize-none`}
            ></textarea>
          </div>

          {/* Action Buttons */}
          <div className="md:col-span-2 flex items-center justify-end gap-4 pt-8 border-t border-gray-100 mt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-3 bg-gray-100 text-gray-500 rounded-2xl hover:bg-gray-200 font-bold transition-all"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-12 py-3 bg-gradient-to-r from-[#2C2D6D] to-[#2D3C90] text-white font-black rounded-2xl hover:shadow-xl hover:shadow-indigo-900/20 transition-all transform hover:-translate-y-1 active:scale-95 shadow-lg"
            >
              อัปเดตข้อมูล
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Update_Event;
