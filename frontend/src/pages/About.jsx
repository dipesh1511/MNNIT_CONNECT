import React from "react";
import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="min-h-screen mt-10 flex items-center justify-center bg-[url('/bg-pattern.png')] bg-cover bg-center p-4">
      <motion.div  initial={{ opacity: 0, y: 50 }}  animate={{ opacity: 1, y: 0 }}  transition={{ duration: 0.6 }}  className="max-w-4xl text-center backdrop-blur-xl bg-white/10 border border-white/30 shadow-2xl rounded-3xl p-10">
        <h1 className="text-4xl font-bold mb-6 text-white">About MNNIT Connect</h1>
        <p className="text-lg text-gray-100 leading-relaxed mb-4">
          <span className="text-blue-400 font-semibold">MNNIT Connect</span> is your digital bridge to a stronger academic and professional community. 
          Built exclusively for the vibrant student and alumni network of <span className="text-yellow-400 font-semibold">Motilal Nehru National Institute of Technology</span>, 
          this platform is more than just a social network — it's a growth engine. 🚀
        </p>
        <p className="text-lg text-gray-100 leading-relaxed mb-4">
          Whether you're seeking academic support, real-world advice from alumni, or looking for the right teammates for a project — MNNIT Connect has you covered. 
          From <span className="text-pink-400 font-semibold">peer-to-peer connections</span> to 
          <span className="text-green-400 font-semibold"> real-time video meetings</span>, everything is just a click away.
        </p>
        <p className="text-lg text-gray-100 leading-relaxed mb-4">
          🌐 <span className="font-semibold text-purple-400">Features at a Glance:</span>
          <br />- Connect with fellow students and alumni<br />
          - Post and explore <span className="text-blue-300">job/internship opportunities</span><br />
          - Academic discussion boards & collaborative groups<br />
          - <span className="text-orange-300">Video call rooms</span> for meetings, interviews, and study sessions<br />
          - Direct messaging and feedback system
        </p>
        <p className="text-lg text-gray-100 leading-relaxed">
          Our mission is to empower every student with the tools they need to thrive — both inside and outside the classroom. 
          With MNNIT Connect, you're not just networking — you're growing, learning, and building your future together. 💡💬
        </p>
      </motion.div>
    </div>
  );
};

export default About;
