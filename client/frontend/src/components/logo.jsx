import React from "react";
import { Link } from "react-router-dom";
import logo from "../assests/logo.png";

const Logo = () => (
  <Link to="/home" className="flex items-center space-x-2">
    <div className="p-2 rounded-md dark:bg-white dark:p-3 dark:shadow-md">
      <img
        src={logo}
        alt="Logo"
        className="w-15 h-12 object-contain transition-opacity hover:opacity-90"
      />
    </div>
  </Link>
);

export default Logo;
