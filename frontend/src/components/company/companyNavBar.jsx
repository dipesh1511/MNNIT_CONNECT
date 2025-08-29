import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LogoLight from "../../assests/logo.png";
import LogoDark from "../../assests/logo-dark.jpeg";

import {
  FaUserCircle,
  FaClipboardList,
  FaPlusSquare,
  FaSignOutAlt,
  FaSignInAlt,
  FaBars,
  FaTimes,
  FaEdit,
  FaMoon,
  FaSun,
  FaVideo,
  FaBriefcase 
} from "react-icons/fa";
import axiosInstance from "../../../config/axios.js";
import logo from "../../assests/logo.png";

const CompanyNavbar = () => {
  // const user = useSelector((state) => state.auth.user);
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  //console.log(user);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/company/logout");
      console.log(user);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      //localStorage.clear();
      navigate("/company/login");
      window.location.reload();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <nav className="shadow-lg bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link
          to={user ? "/company/profile" : "/"}
          className="flex items-center"
        >
         <img
  src={darkMode ? LogoDark : LogoLight}
  alt="Company Logo"
  className="w-25 h-12"
/>

        </Link>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-gray-800 dark:text-white text-2xl md:hidden"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div
          className={`${
            isMenuOpen ? "flex flex-col" : "hidden"
          } md:flex flex-col md:flex-row items-center md:space-x-8 absolute md:relative top-16 md:top-auto left-0 md:left-auto w-full md:w-auto bg-white dark:bg-gray-900 z-10 shadow-lg md:shadow-none border-t md:border-0`}
        >
          {user ? (
            <>
              <Link   to="/company/showjobs"   className="flex items-center space-x-2 text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 py-3 md:py-0 border-b md:border-0 w-full md:w-auto"   onClick={() => setIsMenuOpen(false)} >
                <FaClipboardList />
                <span>Show All Jobs</span>
              </Link>
              <Link   to="/company/postjob"   className="flex items-center space-x-2 text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 py-3 md:py-0 border-b md:border-0 w-full md:w-auto"   onClick={() => setIsMenuOpen(false)} >
                <FaPlusSquare />
                <span>Post Job</span>
              </Link>
              <Link  to="/company/lobby"  className="flex items-center space-x-2 text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 py-3 md:py-0 border-b md:border-0 w-full md:w-auto"  onClick={() => setIsMenuOpen(false)} >
                <FaVideo/>  <span>Meeting</span>
              </Link>

              <Link   to="/company/updateprofile"   className="flex items-center space-x-2 text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 py-3 md:py-0 border-b md:border-0 w-full md:w-auto"   onClick={() => setIsMenuOpen(false)} >
                <FaEdit />
                <span>Update Profile</span>
              </Link>
              <Link    to="/company/profile"    className="flex items-center space-x-2 text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 py-3 md:py-0 border-b md:border-0 w-full md:w-auto"    onClick={() => setIsMenuOpen(false)}  >
                <FaUserCircle />
                <span>Profile</span>
              </Link>


              <button
                onClick={() => {    handleLogout();    setIsMenuOpen(false);  }}  className="flex items-center space-x-2 text-gray-800 dark:text-white hover:text-red-600 dark:hover:text-red-400 py-3 md:py-0 w-full md:w-auto"  >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link  to="/company/login"  className="flex items-center space-x-2 text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 py-3 md:py-0 w-full md:w-auto"  onClick={() => setIsMenuOpen(false)}  >
              <FaSignInAlt />
              <span>Login</span>
            </Link>
          )}

          <button    onClick={() => setDarkMode(!darkMode)}    className="flex items-center space-x-2 text-gray-800 dark:text-white hover:text-yellow-500 dark:hover:text-yellow-300 py-3 md:py-0 w-full md:w-auto"  >
            {darkMode ? <FaSun /> : <FaMoon />}
            <span>{darkMode}</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default CompanyNavbar;
