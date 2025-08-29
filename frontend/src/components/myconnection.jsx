import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axios.js";

const MyConnections = () => {
  const [connections, setConnections] = useState([]);
  const [displayedConnections, setDisplayedConnections] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("name"); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConnections = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/connections");
        setConnections(response.data);
      } catch (error) {
        setError("Error fetching connections.");
        console.error("Error fetching connections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, []);

  const handleLoadMore = () => {
    setDisplayedConnections((prev) => prev + 10);
  };

  // filter connections based on selected field
  const filteredConnections = connections.filter((connection) => {
    const value = connection[searchField];
    if (value) {
      return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    }
    return false;
  });

  return (
    <div className="pt-16">
      <div className="bg-white dark:bg-black min-h-screen px-4 py-8 transition-colors duration-300">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Connections
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              You have {connections.length} connections.
            </p>
          </div>

          {/* Search Input + Dropdown */}
          <div className="mb-6 max-w-md mx-auto flex gap-2">
            <input
              type="text"
              placeholder={`Search by ${searchField}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
            />
            <select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              className="px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
            >
              <option value="name">Name</option>
              <option value="bio">Bio</option>
              <option value="branch">Branch</option>
              <option value="batchYear">Batch Year</option>
              <option value="program">Program</option>
            </select>

          </div>

          {error && (
            <div className="text-red-600 dark:text-red-400 text-center mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center text-gray-700 dark:text-gray-300">
              Loading connections...
            </div>
          ) : filteredConnections.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400">
              No connections found.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredConnections.slice(0, displayedConnections).map((connection) => (
                <div
                  key={connection._id}
                  onClick={() => navigate(`/explore/${connection.username}`)}
                  className="bg-gray-100 dark:bg-gray-900 p-4 rounded-xl shadow hover:shadow-lg transition-all cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={connection.profilePicture || "/avatar.png"}
                      alt={connection.name}
                      className="w-14 h-14 rounded-full border border-gray-300 dark:border-gray-600 object-cover"
                    />
                    <div>
                      <p className="font-semibold text-lg text-gray-900 dark:text-white">
                        {connection.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {connection.bio || "No bio available"}
                      </p>
                    </div>
                  </div>

             
                  <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <p><span className="font-semibold">Branch:</span> {connection.branch || "N/A"}</p>
                    <p><span className="font-semibold">Batch Year:</span> {connection.batch || "N/A"}</p>
                    <p><span className="font-semibold">Program:</span> {connection.program || "N/A"}</p>
                  </div>

                </div>
              ))}
            </div>
          )}

          {displayedConnections < filteredConnections.length && (
            <div className="text-center mt-8">
              <button
                onClick={handleLoadMore}
                className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyConnections;
