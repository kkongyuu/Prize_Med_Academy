import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// ===== component =====
import Navbar from "./components/Navbar";
import Banner from "./components/Banner";

// === page ===
import Home from "./page/home";

function App() {
  return (
    <BrowserRouter>
      {/* <Banner /> */}
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
