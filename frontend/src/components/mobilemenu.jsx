import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {  FaSearch,  FaHome,  FaUsers,  FaBriefcase,  FaUser,  FaEdit,  FaSignOutAlt,  FaPen,  FaClipboardList,  FaComments,  FaCalendarAlt, FaRegStar} from "react-icons/fa";

const MobileMenu = ({ handleLogout }) => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="bg-white dark:bg-black shadow-lg">
      <div className="md:hidden bg-white dark:bg-black border-t border-gray-200 dark:border-gray-700 py-2">
        {user && (
          <div className="flex-grow max-w-md mx-4 relative mb-2">
            <input    type="text"    placeholder="Search"    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"  />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-white" />
          </div>
        )}
        <div className="space-y-1">
          {user && (  <NavLink    to="/home"    className="flex items-center px-4 py-2 text-gray-600 dark:text-white hover:text-blue-500"  >    <FaHome className="mr-2" /> Home  </NavLink>  )}
          {user && (
            <>
              <NavLink    to="/connections"    className="flex items-center px-4 py-2 text-gray-600 dark:text-white hover:text-blue-500"  >    <FaUsers className="mr-2" /> Connections  </NavLink>
              <NavLink    to="/jobs"    className="flex items-center px-4 py-2 text-gray-600 dark:text-white hover:text-blue-500"  >    <FaBriefcase className="mr-2" /> Jobs  </NavLink>
              <NavLink    to="/jobsapplied"    className="block px-4 py-2 text-gray-600 dark:text-white hover:text-blue-500"  >    <FaClipboardList className="inline mr-1" /> Jobs Applied  </NavLink>
              <NavLink    to={`/explore/${user.username}`}    className="flex items-center px-4 py-2 text-gray-600 dark:text-white hover:text-blue-500"  >    <FaUser className="mr-2" /> {user.name}  </NavLink>
              <NavLink    to="/updateprofile"    className="flex items-center px-4 py-2 text-gray-600 dark:text-white hover:text-blue-500"  >    <FaEdit className="mr-2" /> Edit Profile  </NavLink>
              <NavLink    to="/createpost"    className="flex items-center px-4 py-2 text-gray-600 dark:text-white hover:text-blue-500"  >    <FaPen className="mr-2" /> Create Post  </NavLink>
              <NavLink    to="/lobby"    className="flex items-center px-4 py-2 text-gray-600 dark:text-white hover:text-blue-500"  >    <FaCalendarAlt className="mr-2" /> Meeting  </NavLink>
              <NavLink    to="/messages"    className="flex items-center px-4 py-2 text-gray-600 dark:text-white hover:text-blue-500"  >    <FaComments className="mr-2" /> Message  </NavLink>
              <NavLink    to="/experience"    className="flex items-center px-4 py-2 text-gray-600 dark:text-white hover:text-blue-500"  >    <FaRegStar className="mr-2" /> Experience  </NavLink>
              <div    onClick={handleLogout}    className="flex items-center px-4 py-2 text-gray-600 dark:text-white hover:text-blue-500 cursor-pointer"  >    <FaSignOutAlt className="mr-2" /> Logout  </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
