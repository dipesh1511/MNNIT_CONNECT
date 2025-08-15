import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../../config/axios";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ isDarkMode }) => {
  const [query, setQuery] = useState("");
  const [field, setField] = useState("name");
  const [mode, setMode] = useState("prefix");
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const handleSearch = async (loadMore = false) => {
    try {
      const response = await axiosInstance.get("/search", {
        params: { query, field, page, pageSize: 10, mode },
      });

      setTotalResults(response.data.totalResults);
      if (loadMore) {
        setUsers((prev) => [...prev, ...response.data.users]);
      } else {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    if (query) handleSearch();
    else {
      setUsers([]);
      setTotalResults(0);
    }
  }, [query, field, mode]);

  const handleUserClick = (username) => {
    setQuery("");
    setUsers([]);
    setPage(1);
    setTotalResults(0);
    navigate(`/explore/${username}`);
  };  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setQuery("");
        setUsers([]);
        setPage(1);
        setTotalResults(0);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div
      ref={searchRef}
      className="flex-grow max-w-md mx-4 relative hidden md:block"
    >
      {/* Controls */}
      <div className="flex items-center gap-2 mb-1">
        <input
          type="text"
          placeholder="Search..."
          className={`w-full px-3 py-1.5 rounded-md text-sm transition-all focus:outline-none focus:ring-1 border ${
            isDarkMode
              ? "bg-gray-800 text-white border-gray-600 placeholder-gray-400 focus:ring-blue-500"
              : "bg-white text-black border-gray-300 placeholder-gray-500 focus:ring-blue-400"
          }`}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />

        <select
          value={field}
          onChange={(e) => setField(e.target.value)}
          className={`px-2 py-1 rounded-md text-sm border transition-all focus:outline-none focus:ring-1 ${
            isDarkMode
              ? "bg-gray-800 text-white border-gray-600 focus:ring-blue-500"
              : "bg-white text-black border-gray-300 focus:ring-blue-400"
          }`}
        >
          <option value="name">Name</option>
          <option value="skills">Skills</option>
          <option value="title">Title</option>
          <option value="location">Location</option>
          <option value="branch">Branch</option> {/* Added Branch */}
          <option value="batch">Batch</option> {/* Added Batch */}
          <option value="program">Program</option> {/* Added Program */}
        </select>

        <button
          onClick={() => handleSearch()}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all focus:outline-none focus:ring-1 ${
            isDarkMode
              ? "bg-blue-400 hover:bg-blue-500 text-white focus:ring-blue-500"
              : "bg-blue-400 hover:bg-blue-500 text-white focus:ring-blue-500"
          }`}
        >
          Search
        </button>
      </div>

      {/* Results */}
      {users.length > 0 && (
        <div
          className={`absolute w-full max-h-64 overflow-y-auto z-30 rounded-md shadow-md border transition-all ${
            isDarkMode
              ? "bg-gray-900 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          {users.map((user) => (
            <div
              key={user.username}
              onClick={() => handleUserClick(user.username)}
              className={`flex items-center gap-3 px-3 py-2 cursor-pointer text-sm transition-all hover:bg-gray-200 dark:hover:bg-gray-700 ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              <img
                src={user.profilePicture || "/avatar.png"}
                alt="User"
                className="w-8 h-8 rounded-full object-cover border border-gray-300 dark:border-gray-600"
              />
              <h4 className="font-medium">{user.name}</h4>
            </div>
          ))}
        </div>
      )}

      {/* Load More */}
      {totalResults > users.length && (
        <button
          onClick={() => {
            setPage((prev) => prev + 1);
            handleSearch(true);
          }}
          className={`mt-2 w-full py-1.5 rounded-md text-sm font-medium transition-all ${
            isDarkMode
              ? "bg-indigo-700 hover:bg-indigo-800 text-white"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default SearchBar;
