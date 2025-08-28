import React from "react";
import JobCardGrid from "../components/jobcard";

const Jobs = () => {
  return (
    <div className="pt-16">
      <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white flex justify-center">
        <div className="w-full max-w-7xl p-6 sm:p-8 md:p-12">
          <h1 className="text-3xl font-semibold mb-2 text-center">Jobs For You</h1>
          <JobCardGrid />
        </div>
      </div>
    </div>
  );
};

export default Jobs;
