import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../config/axios.js";
import { FaCheck, FaTimes } from "react-icons/fa";

const ConnectionCard = () => {
  const [requests, setRequests] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      setError("");
      try {
        const response = await axiosInstance.get("/connections/requests");
        setRequests(response.data);
      } catch (error) {
        setError("Error fetching connection requests.");
        console.error("Error fetching connection requests:", error);
      }
    };

    fetchRequests();
  }, []);

  const handleAction = async (requestId, action) => {
    setLoadingStates((prev) => ({ ...prev, [requestId]: true }));
    setError("");

    try {
      await axiosInstance.put(`/connections/${action}/${requestId}`);
      setRequests((prev) => prev.filter((req) => req._id !== requestId));
    } catch (error) {
      setError(`Error ${action === "accept" ? "accepting" : "rejecting"} request.`);
      console.error(`Error ${action}ing request:`, error);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [requestId]: false }));
    }
  };

  return (
    <div className="bg-white dark:bg-black text-black dark:text-white p-4">
      <div className="max-w-lg mx-auto p-6 bg-white dark:bg-neutral-900 shadow-xl rounded-3xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
          Received Invitations{" "}
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ({requests.length})
          </span>
        </h2>

        {error && (
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        )}

        {requests.length > 0 ? (
          requests.map((request) => (
            <div
              key={request._id}
              className="bg-white dark:bg-gray-900 p-4 mb-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                <Link
                  to={`/explore/${request.sender.username}`}
                  className="flex items-start gap-4 flex-1 hover:opacity-90 transition"
                >
                  <img
                    src={
                      request.sender.profilePicture ||
                      "/avatar.png"
                    }
                    alt={request.sender.name || "User"}
                    className="w-12 h-12 rounded-full border border-gray-300 dark:border-gray-600 shadow-sm"
                  />
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {request.sender.name || "No Name"}
                    </p>
                    {request.message && (
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                        {request.message}
                      </p>
                    )}
                    {request.sender.bio && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                        {request.sender.bio}
                      </p>
                    )}
                    {/* Displaying branch, batch, and program */}
                    {request.sender.branch && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                        Branch: {request.sender.branch}
                      </p>
                    )}
                    {request.sender.batch && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                        Batch: {request.sender.batch}
                      </p>
                    )}
                    {request.sender.program && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                        Program: {request.sender.program}
                      </p>
                    )}
                  </div>
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => handleAction(request._id, "reject")}
                    className="p-2 rounded-full text-gray-500 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition border border-gray-300 dark:border-gray-600 shadow-sm hover:shadow-md"
                    title="Reject"
                    disabled={loadingStates[request._id]}
                  >
                    <FaTimes className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleAction(request._id, "accept")}
                    className="p-2 rounded-full text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition border border-blue-300 dark:border-blue-700 shadow-sm hover:shadow-md"
                    title="Accept"
                    disabled={loadingStates[request._id]}
                  >
                    {loadingStates[request._id] ? (
                      <span className="text-xs animate-pulse">...</span>
                    ) : (
                      <FaCheck className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            No pending connection requests.
          </p>
        )}
      </div>
    </div>
  );
};

export default ConnectionCard;
