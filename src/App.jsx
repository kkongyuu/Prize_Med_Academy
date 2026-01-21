import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PrivateRoute } from "./function/auth.jsx";

// ===== component =====
import Navbar from "./components/Navbar";
import Banner from "./components/Banner";

// === page ===
import Home from "./page/home";
import Login from "./page/login";
import Register from "./page/register";
import HomeFrom from "./page/Forms/form_page";
import Regis_Forms from "./page/Forms/regis_forms";
import ManagePage from "./page/Manage/manage";
import AddEvents from "./page/Manage/add_event";
import UpdateEvents from "./page/Manage/update_events";
import FindEnrollment from "./page/Forms/findenrollment";
import ManageEnrollmentPage from "./page/Manage/manageEnrollment";

function App() {
  return (
    <BrowserRouter>
      {/* <Banner /> */}
      <Navbar />

      <Routes>
        {/* <Route path="/" element={<Home />} /> */}

        <Route path="/" element={<HomeFrom />} />
        <Route path="/register" element={<Register />} />
        <Route path="/regis_forms" element={<Regis_Forms />} />
        <Route path="/find_enroll" element={<FindEnrollment />} />

        {/* หน้าที่ใครก็เข้าได้ */}
        <Route path="/login" element={<Login />} />
        {/* กลุ่มหน้าที่ต้อง Login ก่อนเท่านั้น (Protected Routes) */}
        <Route element={<PrivateRoute />}>
          <Route path="/manage" element={<ManagePage />} />
          <Route path="/manage/add_event" element={<AddEvents />} />
          <Route path="/manage/update_event" element={<UpdateEvents />} />
          <Route
            path="/manage/manage_enrollment"
            element={<ManageEnrollmentPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
