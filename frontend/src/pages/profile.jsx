import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "../../config/axios.js";
import UsersPost from "../components/userposts.jsx";

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const ProfilePage = () => {
  const { loggedInUser } = useSelector((state) => state.auth);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [connectionStatus, setConnectionStatus] = useState(null);
  const navigate = useNavigate();

  const { username } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axiosInstance.get(`/explore/${username}`);
        if (response.status === 200) 
          {
          setUser(response.data.data);
          if (response.data.data._id) {  fetchConnectionStatus(response.data.data._id);  }
        }
      } catch (error) 
      {
        if (error.response && error.response.status === 404) {  setError("User not found.");  }
        else {  setError("Error fetching user profile.");  }
      } 
      finally {  setLoading(false); }
    };
    fetchUser();
  }, [username, loggedInUser]);

  const fetchConnectionStatus = async (userId) => {
    try {
      const response = await axiosInstance.get(`/connections/status/${userId}`);
      setConnectionStatus(response.data);
    } catch (error) {
      console.error("Error fetching connection status:", error);
    }
  };

  const handleConnect = async () => {
    try {
      await axiosInstance.post(`/connections/request/${user._id}`);
      fetchConnectionStatus(user._id);
    } catch (error) {
      console.error("Error sending connection request:", error);
    }
  };

  const handleRemoveConnection = async () => {
    try {
      await axiosInstance.delete(`/connections/${user._id}`);
      fetchConnectionStatus(user._id);
    } catch (error) {
      console.error("Error removing connection:", error);
    }
  };

  
 
  const renderConnectionButton = () => {
    if (!connectionStatus) return null;
    //console.log(connectionStatus.val);
    const base = "px-4 py-2 text-white rounded-lg ml-4";
    switch (connectionStatus.val) {
      case 0:
        return (   <button className={`${base} bg-blue-500`} onClick={() => navigate("/updateprofile")}>    Edit   </button> );
      case 1: return (     <button className={`${base} bg-red-500`} onClick={handleRemoveConnection}>   Remove Connection </button>   );
      case 2: return (    <button className={`${base} bg-gray-500`} disabled>    Pending  </button>  );
      case 3: return (   <button className={`${base} bg-yellow-500`} onClick={() => navigate("/connections")}>    Pending  </button> );
      case 4: return (   <button className={`${base} bg-green-500`} onClick={handleConnect}>    Connect  </button>  );
      default:
        return null;
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="pt-16">
    <div className="max-w-4xl mx-auto p-4 bg-white dark:bg-black min-h-screen text-gray-900 dark:text-gray-200">
      {/* Cover and Profile Image */}
      <div className="relative">
        <img   src={user.coverPhoto || "/avatar.png"}   alt="Cover"   className="w-full h-64 object-cover rounded-lg shadow" />
        <div className="absolute left-4 -bottom-12 w-24 h-24 sm:w-20 sm:h-20 md:w-16 md:h-16 lg:w-24 lg:h-24 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden shadow-lg">
          <img   src={user.profilePicture || "/avatar.png"}   alt="Profile"   className="w-full h-full object-cover" />
        </div>
      </div>

      {/* User Info */}
      <div className="mt-16 text-center flex justify-center items-center">
        <div>
          <h2 className="text-2xl font-semibold">{user.name}</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
    {user.bio || "No bio available"}
  </p>
        </div>

        
        <div className="ml-4">{user && renderConnectionButton()}</div>
      </div>

      <div className="flex gap-4 mt-4">
        <div className="px-4 py-2 border shadow rounded-xl text-sm font-medium text-white">   Program: {user.program} </div>
        <div className="px-4 py-2 border shadow rounded-xl text-sm font-medium text-white">   Branch: {user.branch} </div>
        <div className="px-4 py-2 border shadow rounded-xl text-sm font-medium text-white">  Batch: {user.batch}</div>
      </div>


      {/* Skills */}
      <div className="mt-8 bg-gray-50 dark:bg-black p-4 rounded-lg shadow-lg border border-gray-300  dark:border-gray-700">
  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Skills</h3>
  <ul className="flex flex-wrap gap-2 mt-2">
    {user.skills && user.skills.length > 0 ? (
      user.skills.map((skill, index) => (
        <li key={index} className="bg-gray-200 dark:bg-black border dark:border-gray-700  px-3 py-1 rounded-full text-gray-800 dark:text-gray-100">  {skill}  </li>
      ))
    ) : (  <li className="bg-gray-200 dark:bg-black text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full">    No skills listed.  </li>  )}
  </ul>
</div>


     {/* Experience */}
<hr className="my-8 border-gray-300 dark:border-gray-600" />
<div className="bg-gray-50 dark:bg-black p-4 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700">
  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Experience</h3>
  {user.experience && user.experience.length > 0 ? (
    user.experience
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
      .map((exp, index) => (
        <div key={index} className="mt-4">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {exp.title} at {exp.company}
          </h4>
          <p className="text-gray-500 dark:text-gray-400">
            {formatDate(exp.startDate)} - {formatDate(exp.endDate) || "Present"}
          </p>
          <p className="text-gray-600 dark:text-gray-300 mt-1">{exp.description}</p>
        </div>
      ))
  ) : (
    <p className="text-gray-600 dark:text-gray-300">No experience listed.</p>
  )}
</div>


    {/* Project */}
<hr className="my-8 border-gray-300 dark:border-gray-600" />
<div className="bg-gray-50 dark:bg-black p-4 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700">
  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Project</h3>
  {user.project && user.project.length > 0 ? (
    user.project
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
      .map((project, index) => (
        <div key={index} className="mt-4">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{project.title}</h4>
          <p className="text-gray-500 dark:text-gray-400">
            {formatDate(project.startDate)} - {formatDate(project.endDate) || "Present"}
          </p>
          <p className="text-gray-600 dark:text-gray-300 mt-1">{project.description}</p>
        </div>
      ))
  ) : (
    <p className="text-gray-600 dark:text-gray-300">No project listed.</p>
  )}
</div>


     {/* Education */}
<hr className="my-8 border-gray-300 dark:border-gray-600" />
<div className="bg-gray-50 dark:bg-black p-4 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700">
  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Education</h3>
  {user.education && user.education.length > 0 ? (
    user.education
      .sort((a, b) => new Date(b.startYear) - new Date(a.startYear))
      .map((edu, index) => (
        <div key={index} className="mt-4">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{edu.instituteName}</h4>
          <p className="text-gray-500 dark:text-gray-400">  {edu.fieldOfStudy} ({edu.startYear} - {edu.endYear || "Present"})  </p>
        </div>
      ))
  ) : (
    <p className="text-gray-600 dark:text-gray-300">No education listed.</p>
  )}
</div>


      {/* User's Posts */}
      {!error && (
        <>
          <hr className="my-8 border-gray-300 dark:border-gray-600" />
          <div className="border-gray-600">
          <UsersPost username={username} />
          </div>
         
        </>
      )}
    </div>
    </div>
  );
};

export default ProfilePage;
