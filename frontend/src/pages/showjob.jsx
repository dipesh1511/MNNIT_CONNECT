import React, { useEffect, useState } from "react";
import axiosInstance from "../../config/axios.js";
import { useParams, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaBuilding } from "react-icons/fa";

const JobDetailsPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applyMessage, setApplyMessage] = useState("");
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    axiosInstance
      .get(`/job/show/${jobId}`)
      .then((response) => {
        if (response.data.success) {
          setJob(response.data.job);
        } else {
          setApplyMessage(" Job details not found.");
          setShowBanner(true);
        }
      })
      .catch((error) => {
        console.error("Error fetching job details:", error.message);
        setApplyMessage("Failed to load job details.");
        setShowBanner(true);
      });
  }, [jobId]);

  const handleApply = () => {
    axiosInstance.post(`/job/apply/${jobId}`)
   
  .then((response) => {
    if (response.data.success) {
      setApplyMessage(" Application submitted successfully!");
    } else {
      setApplyMessage(" Failed to submit application.");
    }
    setShowBanner(true)
    setTimeout(() => {
      setShowBanner(false);
    }, 2500);
      })
      .catch((error) => {
       // console.error("Error applying for job:", error.message);
         console.log(error.message);
        setApplyMessage("An error occurred while applying.");
        setShowBanner(true);

        setTimeout(() => {
          setShowBanner(false);
        }, 3000);
      });
  };

  if (!job)
    return (
      <div className="pt-16">
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
      </div>
    );

    return (
      <div className="pt-16">
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-8">
          {/* Banner Notification */}
          {showBanner && (
            <div  className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white font-semibold text-lg transition-all duration-500 z-[9999] ${  applyMessage.includes("success") ? "bg-green-600" : "bg-red-600"  }`}  >    {applyMessage}  </div>
          )}
    
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
            {/* Job Title */}
            <h1 className="text-4xl font-extrabold text-blue-800 dark:text-blue-400 mb-4">    {job.jobTitle}  </h1>
    
            {/* Location, Company, Salary */}
            <div className="flex flex-wrap items-center text-gray-600 dark:text-gray-300 mb-8">
              <div className="flex items-center mr-6 mb-2">
                <FaMapMarkerAlt className="mr-2 text-blue-600 dark:text-blue-400" />
                <p className="text-lg">{job.location}</p>
              </div>
              <div className="flex items-center mr-6 mb-2">
                <FaBuilding className="mr-2 text-blue-600 dark:text-blue-400" />
                <p>{job.company}</p>
              </div>
              <div className="flex items-center mb-2">
                <span className="text-blue-600 dark:text-blue-400 mr-2">₹</span>
                <p className="text-lg">{job.salary}</p>
              </div>
            </div>
    
            {/* Job Description */}
            <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-300 mb-4">   About the Job </h2>
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-4">   {job.description} </p>
              <div className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed space-y-4">
                <p>    <strong>Status:</strong> {job.status}  </p>
                <p>   <strong>Experience Required:</strong> {job.experience} </p>
    
                {/* Skills */}
                <div>
                  <strong>Skills:</strong>
                  <ul className="list-disc list-inside ml-4">
                    {job.skills.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                </div>
    
                {/* Qualifications */}
                <div>
                  <strong>Qualifications:</strong>
                  <ul className="list-disc list-inside ml-4">
                    {job.qualifications.map((qualification, index) => (
                      <li key={index}>{qualification}</li>
                    ))}
                  </ul>
                </div>
    
                {/* Date Posted */}
                <p>
                  <strong>Date Posted:</strong>{" "}
                  {new Date(job.datePosted).toLocaleDateString()}
                </p>
              </div>
            </div>
    
            {/* Action Buttons */}
            <div className="flex justify-between">
              <button   onClick={() => navigate(-1)}   className="bg-gray-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-gray-600 transition-transform transform hover:scale-105 focus:outline-none" >    Go Back  </button>
              <button  onClick={handleApply}  disabled={applyMessage.includes("success")}  className={`px-8 py-3 rounded-full font-semibold shadow-lg transition-transform transform hover:scale-105 focus:outline-none ${    applyMessage.includes("success")      ? "bg-gray-400 cursor-not-allowed"      : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"  }`}  >    {applyMessage.includes("success") ? "Applied ✅" : "Apply Now"}  </button>
            </div>
          </div>
        </div>
      </div>
    );
    
};

export default JobDetailsPage;
