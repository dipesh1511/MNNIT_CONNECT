import React from "react";
import { Link } from "react-router-dom";
import ConnectionCard from "../components/connectionCard";
import Suggestions from "../components/Suggestions";

const Connections = () => {
  return (
    <div className="pt-4">
    <div className="bg-white dark:bg-black text-gray-900 dark:text-white min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Top Section */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2"></h1>
          <Link  to="/MyConnection"  className="inline-block mt-4 px-5 py-2 bg-blue-400 text-white rounded-md shadow hover:bg-blue-500 transition">  View  Connections  </Link>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 bg-gray-100 dark:bg-black p-5 rounded-2xl border border-gray-300 dark:border-gray-700 shadow-md dark:shadow-gray-800">
            <ConnectionCard />
          </div>

          <div className="flex-1 bg-gray-100 dark:bg-black p-5 rounded-2xl border border-gray-300 dark:border-gray-700 shadow-md dark:shadow-gray-800">
            <Suggestions />
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Connections;
