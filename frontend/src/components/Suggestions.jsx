import React, { useEffect, useState } from "react";
import axios from "../../config/axios.js";
import { Link } from "react-router-dom";

const Suggestions = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getSuggestions = async () => {
    try {
      const { data } = await axios.get("/explore/suggestions");
      if (data.success) {
        setSuggestions(data.data);
      } else {
        setError("Failed to fetch suggestions.");
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error.message);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSuggestions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black py-10 px-4">
      <div className="max-w-xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          People You May Know
        </h2>

        {loading ? (
          <p className="text-gray-600 dark:text-gray-300 text-center">Loading...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : suggestions.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300 text-center">No suggestions available.</p>
        ) : (
          <div className="flex flex-col gap-5">
            {suggestions.map((user) => (
              <Link
                to={`/explore/${user.username}`}
                key={user._id}
                className="flex items-center gap-4 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 p-4 rounded-xl shadow-md hover:shadow-lg transition hover:ring-1 hover:ring-blue-400 dark:hover:ring-blue-300"
              >
                <img
                  src={user.profilePicture || "/avatar.png"}
                  alt="Profile"
                  className="w-14 h-14 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                />
                <div className="flex flex-col">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    {user.name}
                  </h3>
                  {user.bio && (
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                      {user.bio}
                    </p>
                  )}

                  {/* Added Branch, Batch Year, Program */}
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 space-y-1">
                    <p><span className="font-semibold">Branch:</span> {user.branch || "N/A"}</p>
                    <p><span className="font-semibold">Batch Year:</span> {user.batch || "N/A"}</p>
                    <p><span className="font-semibold">Program:</span> {user.program || "N/A"}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Suggestions;
