import React, { useState, useRef, useEffect, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaHome, FaUsers, FaBriefcase, FaRegCommentDots, FaUserCircle, FaEdit, FaSignOutAlt, FaSignInAlt, FaPlusCircle, FaClipboardList, FaEnvelope, FaRobot, FaVideo, FaInfoCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import axiosInstance from "../../config/axios"; // axios instance to make API calls
import defaultImg from "../assests/default.png"; // Default image when the user doesn't have a profile picture

const NavLinks = ({ handleLogout }) => {
  const user = useSelector((state) => state.auth.user); // Getting user data from the redux store
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to control dropdown visibility
  const [profileImage, setProfileImage] = useState(defaultImg); // State for profile image (default image initially)
  const [name, setName] = useState(""); // State for user name
  const dropdownRef = useRef(null); // Ref for the dropdown to detect clicks outside of it

  // Effect to handle clicking outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false); // Close dropdown if clicked outside
      }
    };
    document.addEventListener("mousedown", handleClickOutside); // Listen for outside click
    return () => document.removeEventListener("mousedown", handleClickOutside); // Cleanup listener
  }, []);

  // Fetch user data and set profile image and name
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from localStorage
        if (!token) {
          toast.error("User token not found!"); // Show error if no token is found
          return;
        }

        const response = await axiosInstance.get("/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in request header
          },
        });

        const userData = response.data; // Get the user data from the response
        // console.log("Fetched user:", userData);
        // console.log("Fetched user profile is :", userData.profilePicture);

        if (userData.profilePicture) {
          setProfileImage(userData.profilePicture); // Set profile image if it exists
        }
        if (userData.name) {
          setName(userData.name); // Set user name
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        toast.error("Couldn't load profile image"); // Show error if fetching fails
      }
    };

    fetchUserData(); // Call the fetch function
  }, []);

  // Handle logout click
  const handleLogoutClick = useCallback(() => {
    handleLogout(); // Execute the logout function passed as prop
    setDropdownOpen(false); // Close the dropdown after logout
  }, [handleLogout]);

  // Styling for the active and inactive links
  const navLinkStyle = ({ isActive }) =>
    isActive
      ? "text-blue-400 font-semibold flex items-center gap-2 transition-all" // Active link style
      : "text-gray-600 dark:text-white hover:text-blue-500 hover:dark:text-blue-400 flex items-center gap-2 transition-all"; // Inactive link style

  // Styling for dropdown links
  const dropdownLinkStyle =
    "block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-500 dark:hover:text-blue-400 transition-all";

  return (
    <div className="flex items-center gap-6 text-sm">
      {/* Main navigation links visible only for authenticated users */}
      {user && (
        <>
          <NavLink to="/home" className={navLinkStyle}><FaHome /> Home</NavLink>
          <NavLink to="/connections" className={navLinkStyle}><FaUsers /> My Network</NavLink>
          <NavLink to="/messages" className={navLinkStyle}><FaEnvelope /> Messages</NavLink>
          <NavLink to="/lobby" className={navLinkStyle}><FaVideo /> Meeting</NavLink>
          <NavLink to="/jobs" className={navLinkStyle}><FaBriefcase /> Jobs</NavLink>
          <NavLink to="/experience" className={navLinkStyle}><FaPlusCircle /> Experience</NavLink>
        </>
      )}

      {/* Profile image with dropdown */}
      <div className="relative" ref={dropdownRef}>
        {/* Display user profile image */}
        <img  src={profileImage}  alt="User"  onClick={() => setDropdownOpen((prev) => !prev)}  className="w-8 h-8 rounded-full cursor-pointer object-cover border-2 border-gray-300 dark:border-gray-600 hover:ring-2 hover:ring-blue-500 transition-all"  />

        {/* Dropdown menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-black rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50">
            {user ? (
              <>
                {/* Dropdown links for logged-in users */}
                <NavLink to={`/explore/${user.username}`} className={dropdownLinkStyle} onClick={() => setDropdownOpen(false)}>    <FaUserCircle className="inline mr-2" /> {user.name}  </NavLink>
                <NavLink to="/updateprofile" className={dropdownLinkStyle} onClick={() => setDropdownOpen(false)}>    <FaEdit className="inline mr-2" /> Edit Profile  </NavLink>
                <NavLink to="/jobsapplied" className={dropdownLinkStyle} onClick={() => setDropdownOpen(false)}>    <FaClipboardList className="inline mr-2" /> Jobs Applied  </NavLink>
                <NavLink to="/chat" className={dropdownLinkStyle} onClick={() => setDropdownOpen(false)}>    <FaRobot className="inline mr-2" /> Bot  </NavLink>
                <NavLink to="/about" className={dropdownLinkStyle} onClick={() => setDropdownOpen(false)}>    <FaInfoCircle className="inline mr-2" /> About  </NavLink>
                <NavLink to="/feedback" className={dropdownLinkStyle} onClick={() => setDropdownOpen(false)}>    <FaRegCommentDots className="inline mr-2" /> Feedback  </NavLink>
                {/* Logout button */}
                <button onClick={handleLogoutClick} className={`${dropdownLinkStyle} w-full text-left`}>    <FaSignOutAlt className="inline mr-2" /> Logout  </button>
              </>
            ) : (
              // Login link for users who are not authenticated
              <NavLink to="/login" className={dropdownLinkStyle} onClick={() => setDropdownOpen(false)}>    <FaSignInAlt className="inline mr-2" /> Login  </NavLink>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NavLinks;
