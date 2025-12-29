function Welcome_Page() {
  const sendNotificationTest = async () => {
    console.log("Push response:");
  };

  return (
    <section className="min-h-[80vh] flex items-center justify-center bg-gray-50">
      <div className="max-w-xl w-full  mx-auto bg-white rounded-2xl shadow-xl p-10 text-center">
        <h1 className="text-4xl font-bold text-pink-600 mb-3">
          Prize Med Academy
        </h1>

        <h2 className="text-lg text-gray-500 mb-6">Welcome to home page</h2>

        <p className="text-gray-700 leading-relaxed mb-8">
          ระบบแพลตฟอร์มเพื่อบริหารจัดการงานด้านสุขภาพและบุคลากรการแพทย์
          ออกแบบมาเพื่อรองรับการใช้งานที่ง่ายและมีประสิทธิภาพ
        </p>

        <button
          onClick={sendNotificationTest}
          className="px-8 py-3 bg-pink-600 text-white rounded-full font-medium
                     hover:bg-pink-700 hover:scale-105 transition shadow-lg"
        >
          เริ่มต้นใช้งาน
        </button>
      </div>
    </section>
  );
}

export default Welcome_Page;
