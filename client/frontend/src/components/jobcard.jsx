import React, { useEffect, useState } from "react";
import axiosInstance from "../../config/axios.js";
import { Link } from "react-router-dom";
import { HiOutlineBriefcase, HiOutlineLocationMarker } from "react-icons/hi";

const JobCard = ({ image, title, company, location, salary, id }) => {
  return (
    <Link    to={`/showjob/${id}`}    className="block transform transition-all duration-300 hover:scale-[1.02]"  >
      <div className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 shadow-md hover:shadow-xl rounded-xl p-5 w-full h-52 flex items-start space-x-5 overflow-hidden transition-all duration-300">
        {/* Company Logo */}
        <img  src={image}  alt="Company Logo"  className="w-16 h-16 object-contain rounded-md border border-gray-300 dark:border-gray-600"/>

        {/* Job Details */}
        <div className="flex-1 overflow-hidden space-y-1">
          <h2 className="text-lg font-semibold text-blue-600 dark:text-blue-400 truncate">    {title}  </h2>
          <div className="flex items-center text-sm">
            <HiOutlineBriefcase className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-1" />
            <p className="text-gray-700 dark:text-gray-300 truncate">{company}</p>
          </div>
          <div className="flex items-center text-sm">
            <HiOutlineLocationMarker className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-1" />
            <p className="text-gray-500 dark:text-gray-400 truncate">{location}</p>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-gray-500 dark:text-gray-400 mr-1">₹</span>
            <p className="text-gray-700 dark:text-gray-200 font-medium truncate">    {salary}  </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

const JobCardGrid = () => {
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    axiosInstance
      .get("/job/showactive")
      .then((response) => {
        if (response.data.success) {
          setJobs(response.data.jobs);
        } else {
          console.error("Failed to fetch jobs.");
        }
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
      });
  }, []);

  // Filter jobs based on the search query
  const filteredJobs = jobs.filter((job) => {
    return (
      job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="bg-white dark:bg-black py-8 transition-colors duration-300">
      <div className="container mx-auto px-3">
        {/* Search Bar */}
        <div className="mb-6 flex justify-center">
          <input    type="text"    placeholder="Search by job title, company, or location"    value={searchQuery}    onChange={(e) => setSearchQuery(e.target.value)}    className="w-full sm:w-96 px-4 py-2 border border-gray-300 rounded-md dark:bg-black dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"  />
        </div>

        {/* Job Cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => (
            <JobCard  key={job._id}  image={job.image || "/avatar.png"}  title={job.jobTitle}  company={job.company}  location={job.location}  salary={job.salary}  id={job._id}  className="max-w-xs mx-auto"/>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobCardGrid;
