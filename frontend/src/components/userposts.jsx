import React, { useEffect, useState } from "react";
import axiosInstance from "../../config/axios.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

const UsersPost = ({ username }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axiosInstance.get(`/posts/${username}`);
        // console.log("Response from server:", response.data.posts);
        
        if (response.data.success) {
          setPosts(response.data.posts);
        } else {
          setError("Failed to load posts.");
        }
      } catch (error) {
        setError("Error fetching posts. Please try again.");
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [username, currentUser]);

  const handleDeletePost = async (postId) => {
    try {
      const response = await axiosInstance.delete(`/posts/${postId}`);
      if (response.data.success) {
        toast.success("Post deleted successfully");
        setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      } else {
        toast.error("Error deleting post");
      }
    } catch (error) {
      toast.error("Error deleting post. Please try again.");
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="mt-5 bg-gray-50 dark:bg-black p-3 rounded-lg shadow max-w-full mx-auto border-gray-600">
      <ToastContainer />
      
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">User's Posts</h3>
      {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="mt-4 p-3 bg-white dark:bg-black rounded-lg shadow-sm border dark:border-white">
              <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100">{post.title}</h4>
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">{post.content}</p>

                            
              {post.image ? (
                <a href={post.image} target="_blank" rel="noopener noreferrer">
                  <div className="mt-3 flex justify-center w-full h-40 overflow-hidden rounded-xl shadow-lg transition-transform hover:scale-105">
                    <img src={post.image} alt="Post visual" className="object-cover h-full w-auto" />
                  </div>
                </a>
              ) : post.video ? (
                <a href={post.video} target="_blank" rel="noopener noreferrer">
                  <video    controls    className="mt-3 w-full max-h-52 rounded-xl shadow-lg transition-transform hover:scale-105"    style={{ objectFit: 'cover' }}  >    <source src={post.video} type="video/mp4" />    Your browser does not support the video tag.  </video>
                </a>
              ) : post.file?.endsWith('.pdf') ? (
                <a  href={post.file}  target="_blank"  rel="noopener noreferrer"  className="mt-8 flex flex-col items-center space-y-2 hover:opacity-90 transition"  >
                  <img  src="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg"  alt="PDF preview"  className="w-20 h-24 object-contain"/>
                  <span className="text-red-600 font-medium">View PDF</span>
                </a>
              ) : post.file ? ( <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 italic">    File uploaded but no preview available  </p>) : null}




              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                Posted on: {new Date(post.createdAt).toLocaleDateString()}
              </p>

              <div className="mt-1 text-gray-500 dark:text-gray-400 text-xs">
                <strong>Likes:</strong> {post.likes.length}
              </div>

              {currentUser && currentUser.username === username && (
                <button    onClick={() => handleDeletePost(post._id)}    className="mt-3 bg-red-500 text-white py-1 px-2 text-xs rounded-lg hover:bg-red-600"  >    Delete Post  </button>
              )}
            </div>
          ))
        ) : (  <p className="text-gray-600 dark:text-gray-300">No posts from this user.</p>  )}
      </div>
    </div>
  );
};

export default UsersPost;
