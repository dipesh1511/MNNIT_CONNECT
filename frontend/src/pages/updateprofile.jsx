import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import axiosInstance from "../../config/axios.js";

const UpdateProfilePage = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    profilePicture: "",
    coverPhoto: "",
    skills: "",
    experience: [{ title: "", company: "", startDate: "", endDate: "", description: "" }],
    project: [{ title: "", startDate: "", endDate: "", description: "" }],
    education: [{ instituteName: "", fieldOfStudy: "", startYear: "", endYear: "" }],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFormData({
          name: user.name || "",
          bio: user.bio || "",
          profilePicture: user.profilePicture || "",
          coverPhoto: user.coverPhoto || "",
          skills: user.skills ? user.skills.join(", ") : "",
          experience: user.experience?.length
            ? user.experience
            : [{ title: "", company: "", startDate: "", endDate: "", description: "" }],
          project: user.project?.length
            ? user.project
            : [{ title: "", startDate: "", endDate: "", description: "" }],
          education: user.education?.length
            ? user.education
            : [{ instituteName: "", fieldOfStudy: "", startYear: "", endYear: "" }],
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
          [field]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [field]: "",
      }));
    }
  };

  const handleArrayChange = (e, arrayName, index) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedArray = [...prevData[arrayName]];
      updatedArray[index] = {
        ...updatedArray[index],
        [name]: value,
      };
      return { ...prevData, [arrayName]: updatedArray };
    });
  };

  const handleAddEntry = (arrayName) => {
    setFormData((prevData) => ({
      ...prevData,
      [arrayName]: [
        ...prevData[arrayName],
        arrayName === "experience"
          ? { title: "", company: "", startDate: "", endDate: "", description: "" }
          : arrayName === "project"
          ? { title: "", startDate: "", endDate: "", description: "" }
          : { instituteName: "", fieldOfStudy: "", startYear: "", endYear: "" },
      ],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const transformedData = {
        ...formData,
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill !== ""),
      };
      await axiosInstance.put("/user/updateprofile", transformedData);
      toast.success("Profile updated successfully!");
      setTimeout(() => {
        navigate(`/explore/${user.username}`);
      }, 1500);
    } catch (error) {
      console.error("Error updating profile", error.message);
      toast.error("Error updating profile");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-16">
      <div className="bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-200">
        <div className="max-w-4xl mx-auto p-4">
          <ToastContainer />
          <h2 className="text-2xl font-semibold text-center">Update Profile</h2>
          <form onSubmit={handleSubmit} className="mt-8 space-y-8">
            {/* Name Field */}
            <div className="border p-4 rounded-lg bg-gray-100 dark:bg-gray-800 shadow">
              <label className="block">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            {/* Profile Picture Upload */}
            <div className="border p-4 rounded-lg bg-gray-100 dark:bg-gray-800 shadow">
              <label className="block">Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "profilePicture")}
                className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
              />
              {formData.profilePicture && (
                <img
                  src={formData.profilePicture}
                  alt={`${formData.name}'s profile`}
                  className="mt-2 w-32 h-32 object-cover rounded-full"
                />
              )}
            </div>

            {/* Cover Photo Upload */}
            <div className="border p-4 rounded-lg bg-gray-100 dark:bg-gray-800 shadow">
              <label className="block">Cover Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "coverPhoto")}
                className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
              />
              {formData.coverPhoto && (
                <img
                  src={formData.coverPhoto}
                  alt={`${formData.name}'s cover`}
                  className="mt-2 w-full h-48 object-cover rounded"
                />
              )}
            </div>

            {/* Bio Field */}
            <div className="border p-4 rounded-lg bg-gray-100 dark:bg-gray-800 shadow">
              <label className="block">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Skills Field */}
            <div className="border p-4 rounded-lg bg-gray-100 dark:bg-gray-800 shadow">
              <label className="block">Skills</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="comma-separated"
                className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Experience Fields */}
            <div className="border p-4 rounded-lg bg-gray-100 dark:bg-gray-800 shadow">
              <label className="block">Experience</label>
              {formData.experience.map((exp, index) => (
                <div key={index} className="space-y-4">
                  <input
                    type="text"
                    name="title"
                    value={exp.title}
                    onChange={(e) => handleArrayChange(e, "experience", index)}
                    placeholder="Title"
                    className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                  />
                  <input
                    type="text"
                    name="company"
                    value={exp.company}
                    onChange={(e) => handleArrayChange(e, "experience", index)}
                    placeholder="Company"
                    className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                  />
                  <input
                    type="date"
                    name="startDate"
                    value={exp.startDate}
                    onChange={(e) => handleArrayChange(e, "experience", index)}
                    className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                  />
                  <input
                    type="date"
                    name="endDate"
                    value={exp.endDate}
                    onChange={(e) => handleArrayChange(e, "experience", index)}
                    className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                  />
                  <textarea
                    name="description"
                    value={exp.description}
                    onChange={(e) => handleArrayChange(e, "experience", index)}
                    placeholder="Description"
                    className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddEntry("experience")}
                className="text-blue-500 mt-2"
              >
                + Add Experience
              </button>
            </div>

            {/* Project Fields */}
            <div className="border p-4 rounded-lg bg-gray-100 dark:bg-gray-800 shadow">
              <label className="block">Projects</label>
              {formData.project.map((proj, index) => (
                <div key={index} className="space-y-4">
                  <input
                    type="text"
                    name="title"
                    value={proj.title}
                    onChange={(e) => handleArrayChange(e, "project", index)}
                    placeholder="Project Title"
                    className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                  />
                  <input
                    type="date"
                    name="startDate"
                    value={proj.startDate}
                    onChange={(e) => handleArrayChange(e, "project", index)}
                    className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                  />
                  <input
                    type="date"
                    name="endDate"
                    value={proj.endDate}
                    onChange={(e) => handleArrayChange(e, "project", index)}
                    className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                  />
                  <textarea
                    name="description"
                    value={proj.description}
                    onChange={(e) => handleArrayChange(e, "project", index)}
                    placeholder="Project Description"
                    className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddEntry("project")}
                className="text-blue-500 mt-2"
              >
                + Add Project
              </button>
            </div>

            {/* Education Fields */}
            <div className="border p-4 rounded-lg bg-gray-100 dark:bg-gray-800 shadow">
              <label className="block">Education</label>
              {formData.education.map((edu, index) => (
                <div key={index} className="space-y-4">
                  <input
                    type="text"
                    name="instituteName"
                    value={edu.instituteName}
                    onChange={(e) => handleArrayChange(e, "education", index)}
                    placeholder="Institute Name"
                    className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                  />
                  <input
                    type="text"
                    name="fieldOfStudy"
                    value={edu.fieldOfStudy}
                    onChange={(e) => handleArrayChange(e, "education", index)}
                    placeholder="Field of Study"
                    className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                  />
                  <input
                    type="number"
                    name="startYear"
                    value={edu.startYear}
                    onChange={(e) => handleArrayChange(e, "education", index)}
                    placeholder="Start Year"
                    className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                  />
                  <input
                    type="number"
                    name="endYear"
                    value={edu.endYear}
                    onChange={(e) => handleArrayChange(e, "education", index)}
                    placeholder="End Year"
                    className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddEntry("education")}
                className="text-blue-500 mt-2"
              >
                + Add Education
              </button>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button  type="submit"  disabled={submitting}  className={`${    submitting ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"  } dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-2 px-4 rounded`}  >    {submitting ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfilePage;


