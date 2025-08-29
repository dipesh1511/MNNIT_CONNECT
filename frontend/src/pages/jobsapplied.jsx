import React, { useEffect, useState } from "react";
import axiosInstance from "../../config/axios";
import { NavLink } from "react-router-dom";
import { FaBriefcase, FaBuilding } from "react-icons/fa";
import { toast } from "react-toastify";

const JobsApplied = () => {
  const [jobsApplied, setJobsApplied] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobsApplied = async () => {
      try {
        const response = await axiosInstance.get("/job/showapplied");
        if (response.data && response.data.appliedJobs) {  setJobsApplied(response.data.appliedJobs);  } 
        else {  setJobsApplied([]);  }
      } 
      catch (error) {  toast.error("Failed to load applied jobs. Please try again later.");  } 
      finally {  setLoading(false);  }
    };
    fetchJobsApplied();
  }, []);

  if (loading) return <div className="text-center text-gray-600 dark:text-gray-300">Loading...</div>;

  return (
    <div className="pt-16">
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white flex justify-center">
      <div className="w-full max-w-5xl p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Jobs You Have Applied For</h1>
        {jobsApplied.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>No jobs applied</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobsApplied.map((job) => (
              <div  key={job._id}  className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow-lg hover:shadow-xl transition duration-300 cursor-pointer border border-gray-200 dark:border-gray-700"  >
                <NavLink to={`/showjob/${job._id}`} className="block p-6">
                  <div className="flex items-center mb-4">
                    <FaBuilding className="text-blue-600 dark:text-blue-400 mr-2 text-lg" />
                    <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      {job.company}
                    </p>
                  </div>
                  <h2 className="text-2xl font-medium text-gray-900 dark:text-white mb-2">
                    {job.jobTitle}
                  </h2>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                    <FaBriefcase className="mr-2 text-gray-500 dark:text-gray-400" />
                    <p>{job.location}</p>
                  </div>
                  <div className="flex items-center text-gray-700 dark:text-gray-300 text-lg font-semibold">
                    <span className="mr-2 text-green-500 dark:text-green-400">₹</span>
                    <p>{job.salary}</p>
                  </div>
                </NavLink>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default JobsApplied;
