import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../config/axios.js";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setToken, setUser } from "../../slices/authSlice.js"
import { useDispatch } from "react-redux";
import Cookies from "universal-cookie";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch=useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      toast.error("Email and password are required");
      return false;
    }
    return true;
  }; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axiosInstance.post("/company/login", {
          email: formData.email,
          password: formData.password,
        });

        if (response.data.success) {
          toast.success("Login successful!");
           const cookies = new Cookies();
                    cookies.set("token", response.data.token, { path: "/company/login" });
                    cookies.set("user", response.data.user, { path: "/company/login" });
                    localStorage.setItem("token", response.data.token);
                    localStorage.setItem("user", JSON.stringify(response.data.user));

                   // console.log(response.data.user);
                    //console.log(response.data.token);
                    dispatch(setToken(response.data.token));
                    dispatch(setUser(response.data.user));
                    //console.log(response.data.user);
          navigate("/company/showjobs");
        } else {
          toast.error(response.data.message || "Login failed");
        }
      } catch (error) {
        console.log(error.message);
        toast.error(error.response?.data?.message || "An error occurred. Please try again.");
      }
    }
  };
 
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black transition-colors duration-300">
      <ToastContainer />
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg transition-all">
        <h2 className="text-2xl font-bold text-center text-blue-600 dark:text-blue-400">ALUMINI LOGIN</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 font-semibold">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-1 text-gray-900 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Input with Show/Hide Toggle */}
          <div>
            <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 font-semibold">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 text-gray-900 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 dark:bg-blue-500 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-300">
          Don't have an account?{" "}
          <button onClick={() => navigate("/company/signup")} className="text-blue-600 dark:text-blue-400 hover:underline">
            Sign up here
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
