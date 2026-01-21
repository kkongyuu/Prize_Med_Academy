import { Link } from "react-router-dom";
import Logo from "../assets/img/logo/logoNOBG.png";
import { useState } from "react";

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
    <nav className="sticky top-0 z-[999] bg-white/95 backdrop-blur-md border-b border-[#DBBD40]/30 shadow-sm px-4 py-1 md:px-8 transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-14 md:h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <img
                  src={Logo}
                  alt="Logo"
                  className="h-10 md:h-12 w-auto object-contain transition-transform group-hover:scale-105"
                />
              </div>
              <span className="hidden sm:block text-lg md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#AA832D] to-[#DFAE25]">
                Prize Med Academy
              </span>
            </Link>
          </div>

          {/* Right Section - Only Language Switcher */}
          <div className="flex items-center">
            <div className="flex bg-[#2C2D6D]/5 p-1 rounded-full border border-[#2C2D6D]/10">
              <button
                onClick={() => handleChangeLanguage("TH")}
                className={`px-4 py-1 rounded-full text-[12px] font-bold transition-all ${
                  language === "TH"
                    ? "bg-[#2C2D6D] text-white shadow-md"
                    : "text-[#2C2D6D]/60 hover:text-[#2C2D6D]"
                }`}
              >
                TH
              </button>
              <button
                onClick={() => handleChangeLanguage("EN")}
                className={`px-4 py-1 rounded-full text-[12px] font-bold transition-all ${
                  language === "EN"
                    ? "bg-[#2C2D6D] text-white shadow-md"
                    : "text-[#2C2D6D]/60 hover:text-[#2C2D6D]"
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
