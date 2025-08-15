// import React, { useState, useEffect } from "react";
// import { FaHeart, FaBookmark, FaComment } from "react-icons/fa";
// import { ToastContainer, toast } from "react-toastify";
// import axiosInstance from "../../config/axios";
// import "react-toastify/dist/ReactToastify.css";
// import { Link } from "react-router-dom";
// import { formatDistanceToNow } from "date-fns";

// const PostCard = ({
//   profilePicture,
//   name,
//   bio,
//   description,
//   postImage,
//   postFile,
//   postVideo,
//   initialLikes,
//   initialComments,
//   initialSaves,
//   postId,
//   commentsData,
//   username,
//   createdAt,
// }) => {
//   const [likes, setLikes] = useState(initialLikes || 0);
//   const [comments, setComments] = useState(initialComments || 0);
//   const [saves, setSaves] = useState(initialSaves || 0);
//   const [hasLiked, setHasLiked] = useState(false);
//   const [hasSaved, setHasSaved] = useState(false);
//   const [showCommentBox, setShowCommentBox] = useState(false);
//   const [newComment, setNewComment] = useState("");
//   const [commentList, setCommentList] = useState(commentsData);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const response = await axiosInstance.get(`/posts`);
//         setHasLiked(response.data.hasLiked);
//         setHasSaved(response.data.hasSaved);
//         if (!commentsData || commentsData.length === 0) {
//           setCommentList(response.data.comment);
//         }
//       } catch (error) {
//         toast.error("Error fetching post data");
//       }
//     }
//     fetchData();
//   }, [postId]);

//   const handleLike = async () => {
//     if (hasLiked) return;
//     setLikes((prev) => prev + 1);
//     setHasLiked(true);
//     try {
//       await axiosInstance.post(`/posts/${postId}`);
//     } catch (error) {
//       setLikes((prev) => prev - 1);
//       setHasLiked(false);
//       toast.error("Error updating like");
//     }
//   };

//   const handleSave = async () => {
//     if (hasSaved) return;
//     setSaves((prev) => prev + 1);
//     setHasSaved(true);
//     try {
//       await axiosInstance.post(`/posts/${postId}/save`);
//     } catch (error) {
//       setSaves((prev) => prev - 1);
//       setHasSaved(false);
//       toast.error("Error saving post");
//     }
//   };

//   const handleCommentClick = () => {
//     setShowCommentBox(!showCommentBox);
//   };

//   const handleAddComment = async () => {
//     if (newComment.trim() === "") return;
//     setLoading(true);
//     try {
//       const response = await axiosInstance.post(`/posts/${postId}/comment`, {
//         text: newComment,
//       });
//       setCommentList([...commentList, response.data.comment]);
//       setNewComment("");
//       setComments((prev) => prev + 1);
//     } catch (error) {
//       toast.error("Failed to add comment");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-transparent border-2 border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 p-6 max-w-lg mx-auto rounded-3xl transform hover:scale-105">
//       <ToastContainer />
//       <div className="flex items-center mb-4">
//         <img
//           src={profilePicture}
//           alt="Profile"
//           className="w-14 h-14 rounded-full object-cover mr-4 shadow-sm border-2 border-gray-300 dark:border-gray-600 hover:ring-4 hover:ring-blue-400 transition-all duration-200"
//         />
//         <div>
//           <Link
//             to={`/explore/${username}`}
//             className="font-semibold text-gray-900 dark:text-gray-200 text-lg"
//           >
//             {name || "Unknown User"}
//           </Link>
//           <p className="text-sm text-gray-500 dark:text-gray-400">
//             {bio || "No bio provided"}
//           </p>
//           {createdAt && (
//             <p className="text-xs text-gray-400 dark:text-gray-500">
//               {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
//             </p>
//           )}
//         </div>
//       </div>

//       <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
//         {description || "No description provided."}
//       </p>

//       {postImage && (
//         <img
//           src={postImage}
//           alt="Post"
//           className="w-full max-h-[400px] object-contain rounded-lg mb-4 border-2 border-gray-200 dark:border-gray-600 shadow-sm hover:scale-105 transition-all duration-200"
//         />
//       )}

//       {postVideo && (
//         <video
//           controls
//           className="w-full max-h-[400px] object-contain rounded-lg mb-4 border-2 border-gray-200 dark:border-gray-600 shadow-sm"
//         >
//           <source src={postVideo} type="video/mp4" />
//           Your browser does not support the video tag.
//         </video>
//       )}

//       {postFile && postFile.endsWith(".pdf") && (
//         <div className="w-full flex flex-col items-center justify-center p-4 mb-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 shadow-sm bg-gray-50 dark:bg-gray-800">
//           <img
//             src="https://cdn-icons-png.flaticon.com/512/337/337946.png"
//             alt="PDF"
//             className="w-20 h-20 mb-2"
//           />
//           <p className="text-sm text-gray-700 dark:text-gray-200 mb-2">
//             PDF Document
//           </p>
//           <a
//             href={postFile}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-blue-600 dark:text-blue-400 hover:underline"
//           >
//             View / Download PDF
//           </a>
//         </div>
//       )}

//       <div className="flex justify-evenly items-center text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4">
//         <button  className={`flex items-center space-x-2 ${     hasLiked ? "text-blue-600" : "text-gray-600 dark:text-gray-400"   } hover:text-blue-600 transition-all`}   onClick={handleLike} >
//           <FaHeart className="text-xl" />
//           <span className="text-sm font-medium">{likes}</span>
//         </button>

//         <button    className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-all"    onClick={handleCommentClick}  >
//           <FaComment className="text-xl" />
//           <span className="text-sm font-medium">    {showCommentBox ? "Hide comments" : `(${comments})`}  </span>
//         </button>
// {/* 
//         <button
//           className={`flex items-center space-x-2 ${
//             hasSaved ? "text-blue-600" : "text-gray-600 dark:text-gray-400"
//           } hover:text-blue-600 transition-all`}
//           onClick={handleSave}
//         >
//           <FaBookmark className="text-xl" />
//         </button> */}
//       </div>

//       {showCommentBox && (
//         <div className="mt-4">
//           <div className="mb-4">
//             {commentList?.length > 0 ? (
//               commentList.map((comment, index) => (
//                 <div
//                   key={index}
//                   className="flex items-start space-x-2 mb-2 p-2 rounded-md border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 hover:scale-105 transition-all duration-200"
//                 >
//                   <img
//                     src={comment.user.profilePicture}
//                     alt="User"
//                     className="w-8 h-8 rounded-full object-cover"
//                   />
//                   <div className="flex flex-col">
//                     <span className="font-semibold text-gray-900 dark:text-gray-200 text-sm">
//                       {comment.user.name}
//                     </span>
//                     <span className="text-gray-700 dark:text-gray-300 text-sm">
//                       {comment.text}
//                     </span>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-gray-500 dark:text-gray-400">
//                 No comments yet.
//               </p>
//             )}
//           </div>

//           <textarea
//             value={newComment}
//             onChange={(e) => setNewComment(e.target.value)}
//             placeholder="Write a comment..."
//             className="w-full p-2 border-2 rounded-lg mb-2 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
//           />
//           <button
//             onClick={handleAddComment}
//             className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200"
//           >
//             {loading ? "Posting..." : "Add Comment"}
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PostCard;


import React, { useState, useEffect } from "react";
import { FaHeart, FaBookmark, FaComment } from "react-icons/fa";
import axiosInstance from "../../config/axios";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const PostCard = ({
  profilePicture,
  name,
  bio,
  description,
  postImage,
  postFile,
  postVideo,
  initialLikes,
  initialComments,
  initialSaves,
  postId,
  commentsData,
  username,
  createdAt,
}) => {
  const [likes, setLikes] = useState(initialLikes || 0);
  const [comments, setComments] = useState(initialComments || 0);
  const [saves, setSaves] = useState(initialSaves || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentList, setCommentList] = useState(commentsData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axiosInstance.get(`/posts`);
        setHasLiked(response.data.hasLiked);
        setHasSaved(response.data.hasSaved);
        if (!commentsData || commentsData.length === 0) {
          setCommentList(response.data.comment);
        }
      } catch (error) {
        alert("Error fetching post data");
      }
    }
    fetchData();
  }, [postId]);

  const handleLike = async () => {
    if (hasLiked) return;
    setLikes((prev) => prev + 1);
    setHasLiked(true);
    try {
      await axiosInstance.post(`/posts/${postId}`);
    } catch (error) {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
      alert("Error updating like");
    }
  };

  const handleSave = async () => {
    if (hasSaved) return;
    setSaves((prev) => prev + 1);
    setHasSaved(true);
    try {
      await axiosInstance.post(`/posts/${postId}/save`);
    } catch (error) {
      setSaves((prev) => prev - 1);
      setHasSaved(false);
      alert("Error saving post");
    }
  };

  const handleCommentClick = () => {
    setShowCommentBox(!showCommentBox);
  };

  const handleAddComment = async () => {
    if (newComment.trim() === "") return;
    setLoading(true);
    try {
      const response = await axiosInstance.post(`/posts/${postId}/comment`, {
        text: newComment,
      });
      setCommentList([...commentList, response.data.comment]);
      setNewComment("");
      setComments((prev) => prev + 1);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-transparent border-2 border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 p-6 max-w-lg mx-auto rounded-3xl transform hover:scale-105">
      <div className="flex items-center mb-4">
        <img
          src={profilePicture}
          alt="Profile"
          className="w-14 h-14 rounded-full object-cover mr-4 shadow-sm border-2 border-gray-300 dark:border-gray-600 hover:ring-4 hover:ring-blue-400 transition-all duration-200"
        />
        <div>
          <Link
            to={`/explore/${username}`}
            className="font-semibold text-gray-900 dark:text-gray-200 text-lg"
          >
            {name || "Unknown User"}
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {bio || "No bio provided"}
          </p>
          {createdAt && (
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </p>
          )}
        </div>
      </div>

      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
        {description || "No description provided."}
      </p>

      {postImage && (
        <img
          src={postImage}
          alt="Post"
          className="w-full max-h-[400px] object-contain rounded-lg mb-4 border-2 border-gray-200 dark:border-gray-600 shadow-sm hover:scale-105 transition-all duration-200"
        />
      )}

      {postVideo && (
        <video
          controls
          className="w-full max-h-[400px] object-contain rounded-lg mb-4 border-2 border-gray-200 dark:border-gray-600 shadow-sm"
        >
          <source src={postVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {postFile && postFile.endsWith(".pdf") && (
        <div className="w-full flex flex-col items-center justify-center p-4 mb-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 shadow-sm bg-gray-50 dark:bg-gray-800">
          <img
            src="https://cdn-icons-png.flaticon.com/512/337/337946.png"
            alt="PDF"
            className="w-20 h-20 mb-2"
          />
          <p className="text-sm text-gray-700 dark:text-gray-200 mb-2">
            PDF Document
          </p>
          <a
            href={postFile}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            View / Download PDF
          </a>
        </div>
      )}

      <div className="flex justify-evenly items-center text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4">
        <button
          className={`flex items-center space-x-2 ${
            hasLiked ? "text-blue-600" : "text-gray-600 dark:text-gray-400"
          } hover:text-blue-600 transition-all`}
          onClick={handleLike}
        >
          <FaHeart className="text-xl" />
          <span className="text-sm font-medium">{likes}</span>
        </button>

        <button
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-all"
          onClick={handleCommentClick}
        >
          <FaComment className="text-xl" />
          <span className="text-sm font-medium">
            {showCommentBox ? "Hide comments" : `(${comments})`}
          </span>
        </button>
      </div>

      {showCommentBox && (
        <div className="mt-4">
          <div className="mb-4">
            {commentList?.length > 0 ? (
              commentList.map((comment, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-2 mb-2 p-2 rounded-md border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 hover:scale-105 transition-all duration-200"
                >
                  <img
                    src={comment.user.profilePicture}
                    alt="User"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900 dark:text-gray-200 text-sm">
                      {comment.user.name}
                    </span>
                    <span className="text-gray-700 dark:text-gray-300 text-sm">
                      {comment.text}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No comments yet.
              </p>
            )}
          </div>

          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-2 border-2 rounded-lg mb-2 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          />
          <button
            onClick={handleAddComment}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-200"
          >
            {loading ? "Posting..." : "Add Comment"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PostCard;
