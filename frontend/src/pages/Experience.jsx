import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from "../../config/axios.js";

const ExperienceWall = () => {
  const [form, setForm] = useState({ title: '', content: '', category: 'MNNIT Campus Related' });
  const [showForm, setShowForm] = useState(false);
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('All'); // new state for filtering
  const [searchQuery, setSearchQuery] = useState(''); // new state for search query

  // Fetch posts from backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('/experienceshare/all');
        // console.log(res.data.posts);
        setPosts(res.data.posts);
      } 
      catch (err) {
        console.error('Error fetching posts:', err);
      }
    };
  
    fetchPosts();
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const token = localStorage.getItem("token");
      if (!token) {
        alert('Token not found. Please log in.');
        return;
      }
      const res = await axios.post(
        '/experienceshare/create',
        {
          title: form.title,
          content: form.content,
          category: form.category, 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data);

      setPosts([res.data, ...posts]);
      alert('Post submitted successfully!');
      setForm({ title: '', content: '', category: 'MNNIT Campus Related' });

      setShowForm(false);
    } 
    catch (err) {
      console.error('Error submitting post:', err);
      alert('There was an error submitting your post.');
    }
  };

  const filteredPosts = posts.filter((post) => {
    // First filter based on category
    if (filter === 'Campus Related' && post.category !== 'MNNIT Campus Related') return false;
    if (filter === 'Interview Related' && post.category !== 'Interview Related') return false;

    // Then filter based on search query
    const searchLower = searchQuery.toLowerCase();
    const title = post.title?.toLowerCase() || '';
    const content = post.content?.toLowerCase() || '';
    const user = post.user?.name?.toLowerCase() || '';
    const category = post.category?.toLowerCase() || '';

    return (
      title.includes(searchLower) ||
      content.includes(searchLower) ||
      user.includes(searchLower) ||
      category.includes(searchLower)
    );
  });

  return (
    <div className="p-6 max-w-3xl mx-auto mt-14">
      
      {/* Toggle Button */}
      {!showForm && (
        <div className="text-center mb-8">  <motion.button   onClick={() => setShowForm(true)}  whileHover={{ scale: 1.05 }}  whileTap={{ scale: 0.95 }}  animate={{ scale: [1, 1.03, 1] }}  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}  className="px-8 py-3 text-lg font-semibold rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg hover:shadow-xl hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 transition"  >    Want to share your experience?  </motion.button>  </div>
      )}

      {/* Animate Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form   onSubmit={handleSubmit}  initial={{ opacity: 0, y: -20 }}  animate={{ opacity: 1, y: 0 }}  exit={{ opacity: 0, y: -20 }}  transition={{ duration: 0.3 }}  className="mb-12 p-6 rounded-2xl shadow-xl border border-gray-200 backdrop-blur-md bg-white/20 dark:bg-black/20"  >
            <h1 className="text-2xl font-bold mb-6 text-center text-black dark:text-white">Share Your Experience ✨</h1>

            <div className="mb-4">
              <select   value={form.category}  onChange={(e) => setForm({ ...form, category: e.target.value })}  className="w-full px-5 py-3 text-lg rounded-xl text-black dark:text-white bg-white dark:bg-black border border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"  >
                <option value="MNNIT Campus Related">MNNIT Campus Related</option>
                <option value="Interview Related">Interview Related</option>
              </select>
            </div>

            <div className="mb-4">    <input type="text"  placeholder="Give your post a title..."  className="w-full px-5 py-3 text-lg rounded-xl text-black dark:text-white bg-white dark:bg-black border border-gray-300 dark:border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"  value={form.title}  onChange={(e) => setForm({ ...form, title: e.target.value })}  />  </div>

            <div className="mb-4">    <textarea  placeholder="Share your experience in detail..." className="w-full px-5 py-3 text-base rounded-xl text-black dark:text-white bg-white dark:bg-black border border-gray-300 dark:border-gray-600 shadow-sm resize-none h-40 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition"     value={form.content}     onChange={(e) => setForm({ ...form, content: e.target.value })}  />  </div>

            <div className="flex justify-end gap-4 mt-6">
              <button type="button"  onClick={() => setShowForm(false)} className="px-5 py-2 rounded-xl font-medium text-gray-700 dark:text-white bg-white dark:bg-black border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm transition duration-200"   >       Cancel   </button>
              <button  type="submit" className="px-6 py-2 rounded-xl font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg transition duration-200"    >        Post    </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Search Bar */}
      <div className="flex justify-center mb-8">    <input  type="text"  placeholder="Search experiences..."  className="w-full max-w-md px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"  value={searchQuery}  onChange={(e) => setSearchQuery(e.target.value)}  />  </div>

      {/* Filter Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        <button onClick={() => setFilter('All')}     className={`px-4 py-2 rounded-full text-sm font-semibold ${ filter === 'All' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'   }`}  > All </button>
        <button onClick={() => setFilter('Campus Related')}      className={`px-4 py-2 rounded-full text-sm font-semibold ${ filter === 'Campus Related' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'    }`}    > Campus Related    </button>
        <button onClick={() => setFilter('Interview Related')}     className={`px-4 py-2 rounded-full text-sm font-semibold ${ filter === 'Interview Related' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'   }`}   > Interview Related   </button>
      </div>

      {/* Posts */}
      {filteredPosts.length > 0 ? (
        filteredPosts.map((post) => (
          <motion.div  key={post._id}  initial={{ opacity: 0, scale: 0.95 }}  animate={{ opacity: 1, scale: 1 }}  transition={{ duration: 0.3 }}  className="relative p-6 mb-6 rounded-2xl shadow-xl border border-gray-200 backdrop-blur-sm bg-white/20 dark:bg-black/20" >
            <div className="absolute top-4 right-6 text-right">
              <p className="text-sm text-black dark:text-white font-medium">   {post.user?.name || "Anonymous"} </p>
              <p className="text-xs text-gray-600 dark:text-gray-300">    {new Date(post.createdAt).toLocaleDateString()}  </p>
            </div>
            <h2 className="text-xl font-semibold mb-3 text-black dark:text-white">{post.title}</h2>
            <p className="inline-block border border-gray-400 bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold mb-3">    {post.category ? post.category : "NA"}  </p>
            <p className="text-black dark:text-white whitespace-pre-wrap">{post.content}</p>
          </motion.div>
        ))
      ) : ( <p className="text-center text-gray-600 dark:text-gray-400 mt-12">No experiences found.</p>  )}
    </div>
  );
};

export default ExperienceWall;




