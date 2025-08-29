import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../config/axios.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateCompanyDetails = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    profilePicture: "",
    coverPhoto: "",
    description: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/company/updateprofile");
        const companyData = response.data;

        setFormData({
          profilePicture: companyData.profilePicture || "",
          coverPhoto: companyData.coverPhoto || "",
          description: companyData.description || "",
        });
      } catch (error) {
        console.error("Error fetching profile data", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          [field]: reader.result, // Set as Base64 string
        }));
      };
      reader.readAsDataURL(file); // Convert file to Base64
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.put("/company/updateprofile", formData);
      toast.success("Profile updated successfully!");
      // navigate(`/explore/${companyData.username}`);
    } catch (error) {
      console.error("Error updating profile", error.message);
      toast.error("Error updating profile");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 min-h-screen bg-gray-100 dark:bg-gray-900">
      <ToastContainer />
      <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-200">
        Update Profile
      </h2>
      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        {/* Description Field */}
        <div className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-800 shadow dark:shadow-lg">
          <label className="block text-gray-700 dark:text-gray-200">Bio</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          />
        </div>

        {/* Profile Picture Upload */}
        <div className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-800 shadow dark:shadow-lg">
          <label className="block text-gray-700 dark:text-gray-200">Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "profilePicture")}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          {formData.profilePicture && (
            <img
              src={formData.profilePicture}
              alt="Profile Preview"
              className="mt-2 w-32 h-32 object-cover rounded-full border border-gray-300 dark:border-gray-600"
            />
          )}
        </div>

        {/* Cover Photo Upload */}
        <div className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-800 shadow dark:shadow-lg">
          <label className="block text-gray-700 dark:text-gray-200">Cover Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "coverPhoto")}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          {formData.coverPhoto && (
            <img
              src={formData.coverPhoto}
              alt="Cover Preview"
              className="mt-2 w-full h-48 object-cover rounded border border-gray-300 dark:border-gray-600"
            />
          )}
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-green-500 dark:bg-green-600 text-white py-2 px-6 rounded-lg mt-4 hover:bg-green-600 dark:hover:bg-green-700 transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateCompanyDetails;
