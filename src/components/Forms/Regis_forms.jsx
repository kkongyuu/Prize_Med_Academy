import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { createEnrollment } from "../../function/enrollment";

function Regis_Forms() {
  const location = useLocation();
  const { form: items } = location.state || {};
  const [formData, setFormData] = useState({
    event_id: items?.event_id,
    prefix: "นาย",
    fullname: "",
    phone: "",
    line_id: "",
    email: "",
    professional_license: "",
    billing_info: "",
    additional_comments: "",
    slip_url: "https://example.com/cover.jpg",
  });

  const [previewImage, setPreviewImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        slip_url: "https://example.com/cover.jpg",
      }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: "กำลังส่งข้อมูล...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const result = await createEnrollment(items.event_id, formData);
      if (result.success) {
        await Swal.fire({
          icon: "success",
          title: "ลงทะเบียนสำเร็จ",
          text: result.message || "ระบบได้รับข้อมูลการสมัครของคุณเรียบร้อยแล้ว",
          confirmButtonColor: "#2C2D6D", // เปลี่ยนเป็นสีน้ำเงินเข้ม
        });
      }
    } catch (error) {
      console.error("Submit Error:", error);
      const status = error.response?.status;
      const serverMessage = error.response?.data?.message;

      let errorTitle = "เกิดข้อผิดพลาด";
      let errorText = serverMessage || "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้";

      if (status === 400) errorTitle = "ข้อมูลไม่ถูกต้อง";
      else if (status === 404) errorTitle = "ไม่พบข้อมูลโครงการ";
      else if (status === 500) {
        errorTitle = "เซิร์ฟเวอร์ขัดข้อง";
        errorText = "เกิดข้อผิดพลาดที่ระบบหลังบ้าน โปรดติดต่อเจ้าหน้าที่";
      }

      Swal.fire({
        icon: "error",
        title: errorTitle,
        text: errorText,
        confirmButtonColor: "#AA832D", // เปลี่ยนเป็นสีทอง
      });
    }
  };

  return (
    <section className="min-h-screen bg-[#F9F7F2] py-12 px-4 font-noto">
      <div className="max-w-6xl mx-auto">
        {/* Header - ปรับเป็นธีมสีน้ำเงินตัดทอง */}
        <div className="bg-[#2C2D6D] rounded-t-3xl shadow-xl p-8 text-white relative overflow-hidden border-b-4 border-[#AA832D]">
          {/* Decorative Pattern Overlay */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#AA832D] opacity-10 rounded-full -mr-20 -mt-20"></div>

          <div className="relative z-10">
            <span className="bg-[#AA832D] text-white px-4 py-1 rounded-full text-xs font-bold mb-3 inline-block uppercase tracking-wider shadow-sm">
              Course ID: {items?.event_id}
            </span>
            <h1 className="text-3xl font-bold mb-4 leading-tight">
              {items?.event_name}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-sm bg-white/10 rounded-xl p-4 backdrop-blur-md border border-white/20">
              <div className="flex items-center gap-2 text-[#DFAE25]">
                <span className="text-lg">🗓️</span>
                <span className="font-semibold text-white">
                  {items?.event_date}
                </span>
              </div>
              <div className="flex items-center gap-2 border-l border-white/30 pl-6 text-[#DBBD40]">
                <span className="text-sm text-white/80">ค่าลงทะเบียน:</span>
                <span className="font-bold text-xl text-white">
                  {Number(items?.event_fee).toLocaleString()} บาท
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-b-3xl shadow-xl p-8 md:p-10 border-x border-b border-gray-100">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          >
            {/* Left Column: ข้อมูลส่วนตัว */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#2C2D6D] border-l-4 border-[#AA832D] pl-4">
                ข้อมูลผู้สมัคร
              </h2>

              <div className="flex gap-3">
                <div className="w-32">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    คำนำหน้า
                  </label>
                  <select
                    name="prefix"
                    value={formData.prefix}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#AA832D] focus:border-transparent bg-gray-50 transition-all outline-none"
                  >
                    <option value="นาย">นาย</option>
                    <option value="นาง">นาง</option>
                    <option value="นางสาว">นางสาว</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    ชื่อ - นามสกุล <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#AA832D] focus:border-transparent bg-gray-50 transition-all outline-none"
                    placeholder="กรอกชื่อ - นามสกุล"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    เบอร์โทรศัพท์ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#AA832D] focus:border-transparent bg-gray-50 transition-all outline-none"
                    placeholder="0XX-XXX-XXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    ID Line
                  </label>
                  <input
                    type="text"
                    name="line_id"
                    value={formData.line_id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#AA832D] focus:border-transparent bg-gray-50 transition-all outline-none"
                    placeholder="กรอก Line ID"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#AA832D] focus:border-transparent bg-gray-50 transition-all outline-none"
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 leading-relaxed">
                  เลขที่ใบประกอบวิชาชีพ ก.{" "}
                  <span className="text-[#AA832D] font-medium text-xs">
                    (เฉพาะตัวเลขไม่ต้องพิมพ์ ก.)
                  </span>{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="professional_license"
                  value={formData.professional_license}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#AA832D] focus:border-transparent bg-gray-50 transition-all outline-none"
                  placeholder="เช่น 5976"
                />
              </div>
            </div>

            {/* Right Column: การชำระเงินธีมทอง */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#2C2D6D] border-l-4 border-[#DFAE25] pl-4">
                การชำระเงิน
              </h2>

              <div className="bg-gradient-to-br from-[#fdf8e6] to-[#f7f0d5] border border-[#DBBD40]/30 rounded-2xl p-6 shadow-inner relative overflow-hidden">
                <div className="flex justify-between items-center mb-4 font-bold text-[#AA832D]">
                  <span className="text-lg">ยอดที่ต้องชำระ:</span>
                  <span className="text-3xl font-black">
                    {Number(items?.event_fee).toLocaleString()} ฿
                  </span>
                </div>

                <div className="space-y-3 border-t border-[#DBBD40]/20 pt-4">
                  <p className="text-[13px] font-bold text-[#2C2D6D] flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#AA832D] rounded-full"></span>
                    ธนาคารไทยพาณิชย์ (SCB)
                  </p>
                  <p className="text-[13px] text-gray-600 font-medium pl-4">
                    บจก.เดอะไพร์ส แอนด์ ดรีมส์ เอ็นเตอร์ไพร์ส
                  </p>
                  <div className="flex items-center gap-3 text-[#2C2D6D] pl-4">
                    <span className="text-xs font-semibold text-gray-500">
                      เลขที่บัญชี:
                    </span>
                    <span className="text-2xl font-black tracking-widest text-[#2C2D6D]">
                      434-1-23659-6
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  อัพโหลดสลิปการโอนเงิน <span className="text-red-500">*</span>
                </label>
                <div className="relative border-2 border-dashed border-[#DBBD40]/40 rounded-2xl p-4 text-center hover:bg-[#AA832D]/5 transition-all cursor-pointer group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="payment-upload"
                    required
                  />
                  <label htmlFor="payment-upload" className="cursor-pointer">
                    {previewImage ? (
                      <div className="space-y-2">
                        <img
                          src={previewImage}
                          alt="slip preview"
                          className="max-h-52 mx-auto rounded-lg shadow-md border-2 border-white"
                        />
                        <p className="text-xs text-[#AA832D] font-bold mt-2">
                          คลิกเพื่อเปลี่ยนรูปภาพ
                        </p>
                      </div>
                    ) : (
                      <div className="py-8">
                        <div className="text-3xl mb-2">📸</div>
                        <p className="text-gray-400 text-sm font-medium">
                          คลิกเพื่ออัพโหลดสลิป{" "}
                          <span className="text-[#AA832D]">(.jpg, .png)</span>
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  ที่อยู่สำหรับการออกใบเสร็จ{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="billing_info"
                  value={formData.billing_info}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#AA832D] focus:border-transparent bg-gray-50 transition-all outline-none"
                  placeholder="ระบุชื่อและที่อยู่ที่ต้องการให้ปรากฏบนใบเสร็จ"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-4 bg-[#2C2D6D] hover:bg-[#2D3C90] text-[#DFAE25] rounded-xl font-bold text-lg hover:shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2 border-b-4 border-[#1c1d45]"
                >
                  ยืนยันการสมัครและส่งข้อมูล
                </button>
                <p className="text-center text-[10px] text-gray-400 mt-3 italic">
                  * กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนกดยืนยัน
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Regis_Forms;
