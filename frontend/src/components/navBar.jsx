import React, { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Sun, Moon } from "lucide-react";
import LogoLight from "../assests/logo.png";
import LogoDark from "../assests/logo-dark.jpeg";
import SearchBar from "./searchbar.jsx";
import NavLinks from "./navlink.jsx";
import MobileMenu from "./mobilemenu.jsx";
import axiosInstance from "../../config/axios.js";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearUser } from "../slices/authSlice.js";
import { Link } from "lucide-react";
const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/user/logout");
      dispatch(clearUser());
      localStorage.clear();
      console.log("User logged out successfully.");
      navigate("/login");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };
  const handleLogoClick = () => {
    navigate('/home');  
  };

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  const hideSearchBarRoutes = ["/login", "/register", "/messages", "/MyConnection", "/jobs","/signup"];
  const shouldHideSearchBar = hideSearchBarRoutes.includes(location.pathname);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gray-100 dark:bg-black shadow-md border-b border-blue-300 dark:border-blue-400 shadow-blue-400/50 dark:shadow-blue-500/50">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        {/* Logo based on theme */}
       
        <img
          src={theme === "dark" ? LogoDark : LogoLight}
          alt="Logo"
          className="h-6 w-auto sm:h-8 md:h-10"
          onClick={handleLogoClick}
        />
      

        {!shouldHideSearchBar && <SearchBar />}

        <div className="hidden md:flex space-x-6 items-center">
          <NavLinks handleLogout={handleLogout} />

          {/* Theme Toggle Button */}
          <div className="relative group w-fit">
            <button
              className="p-2 rounded-full transition-all duration-300 hover:rotate-180 hover:scale-110 active:scale-95 bg-gray-200 dark:bg-black text-gray-800 dark:text-gray-100"
              aria-label="Toggle theme"
              onClick={toggleTheme}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-500" />
              )}
            </button>
            <span className="absolute top-10 left-1/2 -translate-x-1/2 px-2 py-1 text-xs rounded bg-black text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            </span>
          </div>
        </div>

        <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? (
            <FaTimes className="text-2xl text-gray-600 dark:text-white" />
          ) : (
            <FaBars className="text-2xl text-gray-600 dark:text-white" />
          )}
        </button>
      </div>

      {isMobileMenuOpen && <MobileMenu handleLogout={handleLogout} />}
    </nav>
  );
};

export default NavBar;
