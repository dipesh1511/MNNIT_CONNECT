import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../config/axios.js";

const ExploreProfile = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get(`/explore/${username}`);
      setUser(data);
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [username]);

  if (loading)
    return (
      <div className="pt-16">
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 p-4 items-center justify-center">
        <p className="text-gray-700 dark:text-gray-300">Loading...</p>
      </div>
    );

  if (!user)
    return (
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 p-4 items-center justify-center">
        <p className="text-red-600 dark:text-red-400">User not found or server error.</p>
      </div>
    );

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow p-6 w-full">
        <div className="flex flex-col items-center">
          <img
            src={user.profilePicture || "/avatar.png"}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover"
          />
          <h2 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">
            {user.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">@{user.username}</p>
          <p className="mt-2 text-gray-700 dark:text-gray-300">
            {user.bio || "No bio provided."}
          </p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ExploreProfile;
