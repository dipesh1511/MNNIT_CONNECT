import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";  
import { motion } from "framer-motion";
import axios from "axios";  
import "react-toastify/dist/ReactToastify.css";  

const Feedback = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/send/feedback", formData); 
      if (response.data.success) 
      {
        toast.success("Feedback sent! Thank you ");  
        setFormData({ name: "", email: "", message: "" });
      } 
      else {
        toast.error("Something went wrong ");  
      }
    } catch (error) {
      console.error("Error sending feedback:", error);
      toast.error("Something went wrong ");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/bg-pattern.png')] bg-cover bg-center p-4">
      <motion.form   initial={{ opacity: 0, scale: 0.95 }}   animate={{ opacity: 1, scale: 1 }}   transition={{ duration: 0.5 }}   onSubmit={handleSubmit}   className="w-full max-w-lg backdrop-blur-2xl bg-white/10 border border-white/30 shadow-2xl rounded-3xl p-8 space-y-6" >
        <h2 className="text-3xl font-bold text-white text-center">We'd love your Feedback!</h2>
        <input   type="text"   name="name"   placeholder="Your Name"   required   value={formData.name}   onChange={handleChange}   className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-gray-200 outline-none focus:ring-2 focus:ring-blue-400" />
        <input   type="email"   name="email"   placeholder="Your Email"   required   value={formData.email}   onChange={handleChange}   className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-gray-200 outline-none focus:ring-2 focus:ring-blue-400" />
        <textarea  name="message"  placeholder="Your Message"  required  rows="4"  value={formData.message}  onChange={handleChange}  className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-gray-200 outline-none focus:ring-2 focus:ring-blue-400"  />
        <button    type="submit"    className="w-full bg-blue-500 hover:bg-blue-600 transition-all text-white font-semibold py-3 rounded-xl shadow-md"  >    Send Feedback ✉️  </button>
      </motion.form>
      <ToastContainer />
    </div>
  );
};

export default Feedback;
