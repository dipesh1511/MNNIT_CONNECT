import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon } from "react-icons/fa";

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="border-b-2">
      <div className="flex justify-between items-center py-3 px-4 flex-wrap">
        {/* Logo */}
        <Link
          to="/"
          className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
        >
          <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 via-pink-500 rounded-lg text-white">
            Rapper's Place
          </span>
        </Link>

        {/* Search Input (Visible on large screens) */}
        <form className="hidden lg:block">
          <input
            type="text"
            placeholder="search..."
            className="px-3 py-2 border rounded-lg"
          />
        </form>

        {/* Toggle button (Visible on small screens) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="block lg:hidden p-2 rounded-md focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>

        {/* Right side buttons */}
        <div className="flex gap-2">
          <button className="hidden sm:inline w-12 h-10 text-gray-700 dark:text-gray-400">
            <FaMoon />
          </button>
          <Link to="/sign-in">
            <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-2 rounded-lg">
              Sign In
            </button>
          </Link>
        </div>
      
      {/* Navigation Links (Same line on all screens) */}
      
        <ul className="flex flex-col lg:flex-row lg:gap-4 text-center lg:text-left">
          <li>
            <Link
              to="/"
              className="block py-2 lg:p-0 text-gray-700 dark:text-white"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="block py-2 lg:p-0 text-gray-700 dark:text-white"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="/battle"
              className="block py-2 lg:p-0 text-gray-700 dark:text-white"
            >
              Battle
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Header;

/*

import { Navbar ,TextInput ,Button , NavbarCollapse} from 'flowbite-react'
import React from 'react'
import {Link } from 'react-router-dom'
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon } from "react-icons/fa";


function Header() {
  return (
    <Navbar className="border-b-2">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm  sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 via-pink-500  rounded-lg text-white">
          Rapper's Place
        </span>
      </Link>
      <form>
        <TextInput
          type="text"
          placeholder="search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
        />
      </form>
      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button>
      <div className="flex gap-2 md:order-2">
        <Button className="w-12 h-10 hidden sm:inline" color="gray" pill>
          <FaMoon />
        </Button>
        <Link to="/sign-in" className="inline-block">
          <Button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white w-14">
            Sign In
          </Button>
        </Link>
      </div>
      <Navbar.Collapse>
        <Link to="/sign-in" className="inline-block">
          <Button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white w-14">
            Sign In
          </Button>
        </Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
  

export default Header

*/
