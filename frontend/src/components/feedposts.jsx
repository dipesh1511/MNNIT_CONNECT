import React, { useState, useEffect } from "react";
import axiosInstance from "../../config/axios";
import PostCard from "./postcard";
import { formatDistanceToNow } from 'date-fns';

const Feedposts = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      if (loading || page > totalPages) return;

      setLoading(true);
      try {
        const response = await axiosInstance.get(`/posts`, {
          params: { page, limit: 10 },
        });

        // If no posts are returned, stop the loading process
        if (response.data.posts.length === 0) {
          setLoading(false);
          return;
        }

        setPosts((prevPosts) => {
          const existingIds = new Set(prevPosts.map((p) => p._id));
          const newUniquePosts = response.data.posts.filter(
            (p) => !existingIds.has(p._id)
          );
          return [...prevPosts, ...newUniquePosts];
        });

        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false); 
      } finally {
        setLoading(false); 
      }
    };

    fetchPosts();
  }, [page, totalPages, loading]);

  return (
   
      <div className="bg-white dark:bg-black shadow-xl rounded-lg transition-all duration-300 ease-in-out">
        <div className="mt-6 px-6 pb-10 space-y-6">
          {posts.length === 0 && !loading && (
            <div className="flex justify-center items-center mt-6 text-gray-500">
              No posts available.
            </div>
          )}

          {posts.map((post, index) => (
            <div
              key={post._id || index}
              className="transform transition-all duration-300 hover:scale-[1.01] hover:shadow-lg"
            >
              <PostCard
              profilePicture={post.user?.profilePicture}  name={post.user?.name}  bio={post.user?.bio}  description={post.content}  postImage={post.image}  postFile={post.file}  postVideo={post.video}  initialLikes={post.likes.length}  initialComments={post.comments.length}  initialSaves={post.saves?.length || 0}  postId={post._id}  commentsData={post.comments}  username={post.user?.username}  createdAt={post.createdAt}  />
            </div>
          ))}

          {loading && (
            <div className="flex justify-center items-center mt-6">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {page < totalPages && !loading && (
            <div className="flex justify-center">
              <button
                onClick={() => setPage((prevPage) => prevPage + 1)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2 px-8 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
                disabled={loading}
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </div>
      </div>
   
  );
};

export default Feedposts;
