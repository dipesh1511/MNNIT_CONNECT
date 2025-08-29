import React, { useState, useEffect } from "react";
import axiosInstance from "../../../config/axios.js";

const CompanyProfile = () => {
  // State to store company profile data
  const [companyData, setCompanyData] = useState({
    coverPhoto: "",
    profilePicture: "",
    name: "",
    email: "",
    description: "",
  });

  // Fetch company profile data from backend
  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        const response = await axiosInstance.get("/company/profile");
        //console.log(response.data);
        setCompanyData(response.data);
      } catch (error) {
        console.error("Error fetching company profile:", error);
      }
    };

    fetchCompanyProfile();
  }, []);

  // Destructure the data from state
  const { coverPhoto, profilePicture, name, email, description } = companyData;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center">
      {/* Cover Photo */}
      <div className="w-full h-60 bg-gray-300 dark:bg-gray-700">
        {coverPhoto ? (
          <img
            src={coverPhoto}
            alt={`${name} cover`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex justify-center items-center w-full h-full text-gray-500 dark:text-gray-400">
            No Cover Photo
          </div>
        )}
      </div>

      {/* Profile Section */}
      <div className="w-full max-w-4xl -mt-20 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="flex items-center space-x-6">
          {/* Profile Picture */}
          <div className="w-36 h-36 rounded-full bg-gray-300 dark:bg-gray-700 border-4 border-white dark:border-gray-600">
            {profilePicture ? (
              <img
                src={profilePicture}
                alt={`${name} profile`}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="flex justify-center items-center w-full h-full text-gray-500 dark:text-gray-400">
                No Profile Picture
              </div>
            )}
          </div>

          {/* Company Details */}
          <div className="flex flex-col space-y-2">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{name}</h1>
            <p className="text-gray-600 dark:text-gray-400">{email}</p>
          </div>
        </div>

        {/* Description */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-300">Description</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {description || "No description available."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
