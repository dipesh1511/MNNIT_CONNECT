import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../../config/axios.js";
import { ToastContainer, toast } from "react-toastify";
import { MdLocationOn } from "react-icons/md";
import { BiRupee } from "react-icons/bi";

import "react-toastify/dist/ReactToastify.css";

const CompanyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const company = await axiosInstance.get("/company/profile");
      const response = await axiosInstance.get(
        `/job/showall/${company.data._id}`
      );

      if (response.data.success) {
        setJobs(response.data.jobs);
      } else {
        toast.error("Failed to load jobs.");
      }
    } catch (error) {
      toast.error("Error loading jobs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100 dark:bg-gray-900">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400 mb-8">
        Your Job Posts
      </h1>

      {loading ? (
        <p className="text-center text-gray-600 dark:text-gray-400">
          Loading jobs...
        </p>
      ) : jobs.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400">
          No jobs found.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <Link
              to={`/company/${job._id}`}
              key={job._id}
              className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl dark:hover:shadow-2xl transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                {job.jobTitle}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 text-sm">
                {job.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <div className="flex items-center bg-blue-100 dark:bg-blue-600/20 text-blue-600 dark:text-blue-300 text-sm font-medium px-3 py-1 rounded-full">
                  <MdLocationOn className="mr-1" />
                  {job.location}
                </div>
                <div className="flex items-center bg-green-100 dark:bg-green-600/20 text-green-600 dark:text-green-300 text-sm font-medium px-3 py-1 rounded-full">
                  <BiRupee className="mr-1" />
                  {job.salary}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyJobs;
