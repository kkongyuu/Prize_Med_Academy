import { Link } from "react-router-dom";
import Logo from "../assets/img/logo/Rmed.png";
import { useState } from "react";
import { FaLine, FaPhoneAlt } from "react-icons/fa";

function NavBar() {
  const [language, setLanguage] = useState("TH");

  const translateTo = (lang) => {
    const combo = document.querySelector(".goog-te-combo");
    if (combo) {
      combo.value = lang;
      combo.dispatchEvent(new Event("change"));
    }
  };

  const resetTranslate = () => {
    const domains = [
      window.location.hostname,
      "." + window.location.hostname.replace(/^www\./, ""),
      window.location.hostname.includes(".")
        ? window.location.hostname.substring(
            window.location.hostname.indexOf(".")
          )
        : "",
    ];
    domains.forEach((d) => {
      document.cookie = `googtrans=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
      document.cookie = `googtrans=;expires=Thu, 01 Jan 1970 00:00:00 GMT;domain=${d};path=/;`;
    });
    window.location.reload();
  };

  const handleChangeLanguage = (lang) => {
    setLanguage(lang);
    if (lang === "EN") translateTo("en");
    if (lang === "TH") resetTranslate();
  };

  return (
    <nav className="sticky top-0 z-[999] bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-lg px-4 py-4 md:px-8 transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <img
                  src={Logo}
                  alt="Prized Mad Academy Logo"
                  className="h-11 md:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#b38b4d]/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-lg md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#b38b4d] to-[#d4a574] transition-all duration-300">
                  Prize Med Academy
                </span>
              </div>
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Contact Info - Desktop */}
            <div className="hidden lg:flex items-center gap-3 bg-gradient-to-r from-[#b38b4d]/10 to-[#d4a574]/10 px-4 py-2 rounded-full border border-[#b38b4d]/20">
              <FaPhoneAlt className="text-[#b38b4d] text-sm" />
              <a
                href="tel:0989232424"
                className="text-[#b38b4d] font-bold text-lg hover:text-[#d4a574] transition-colors duration-300"
              >
                098-923-2424
              </a>
            </div>

            {/* Line & Phone - Icons */}
            <div className="flex items-center gap-3">
              <a
                href="https://lin.ee/WSgSvsl"
                target="_blank"
                rel="noopener noreferrer"
                className="relative group"
                aria-label="Line"
              >
                <div className="absolute inset-0 bg-[#06c755]/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                <div className="relative bg-white p-2 rounded-full border-2 border-[#06c755]/30 hover:border-[#06c755] transition-all duration-300 hover:shadow-lg hover:shadow-[#06c755]/20 hover:scale-110">
                  <FaLine className="text-[#06c755]" size={24} />
                </div>
              </a>
              <a
                href="tel:0989232424"
                className="lg:hidden relative group"
                aria-label="Call"
              >
                <div className="absolute inset-0 bg-[#b38b4d]/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                <div className="relative bg-white p-2 rounded-full border-2 border-[#b38b4d]/30 hover:border-[#b38b4d] transition-all duration-300 hover:shadow-lg hover:shadow-[#b38b4d]/20 hover:scale-110">
                  <FaPhoneAlt className="text-[#b38b4d]" size={18} />
                </div>
              </a>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-full border border-gray-200 shadow-inner">
              <button
                onClick={() => handleChangeLanguage("TH")}
                className={`relative w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center text-xs md:text-sm font-bold transition-all duration-300 ${
                  language === "TH"
                    ? "bg-gradient-to-br from-gray-800 to-black text-white shadow-lg scale-105"
                    : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                }`}
              >
                {language === "TH" && (
                  <div className="absolute inset-0 bg-black rounded-full blur-md opacity-30"></div>
                )}
                <span className="relative z-10">TH</span>
              </button>
              <button
                onClick={() => handleChangeLanguage("EN")}
                className={`relative w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center text-xs md:text-sm font-bold transition-all duration-300 ${
                  language === "EN"
                    ? "bg-gradient-to-br from-gray-800 to-black text-white shadow-lg scale-105"
                    : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                }`}
              >
                {language === "EN" && (
                  <div className="absolute inset-0 bg-black rounded-full blur-md opacity-30"></div>
                )}
                <span className="relative z-10">EN</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
