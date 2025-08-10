// import React, { useState, useEffect } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axiosInstance from "../../config/axios";
// import defaultImg from "../assests/default.png";
// import { X, ImagePlus, FileText } from "lucide-react";

// const PostCreatorPage = () => {
//   const [text, setText] = useState("");
//   const [image, setImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [profileImage, setProfileImage] = useState(defaultImg);
//   const [video, setVideo] = useState(null);
//   const [videoPreview, setVideoPreview] = useState(null);
//   const [pdf, setPdf] = useState(null);
//   const [toastShown, setToastShown] = useState(false); // Prevent duplicate success toasts

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           toast.error("User token not found!");
//           return;
//         }

//         const response = await axiosInstance.get("/user/profile", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         const user = response.data;
//         if (user.profilePicture) {
//           setProfileImage(user.profilePicture);
//         }
//       } catch (error) {
//         toast.error("Couldn't load profile image");
//       }
//     };

//     fetchUserData();
//   }, []);

//   const handleTextChange = (e) => setText(e.target.value);

//   const handleImageChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       const selectedImage = e.target.files[0];
//       setImage(selectedImage);
//       setImagePreview(URL.createObjectURL(selectedImage));
//     }
//   };

//   const handleVideoChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       const selectedVideo = e.target.files[0];
//       setVideo(selectedVideo);
//       setVideoPreview(URL.createObjectURL(selectedVideo));
//     }
//   };

//   const handlePdfChange = (e) => {
//     if (e.target.files && e.target.files[0]) {
//       setPdf(e.target.files[0]);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!text) {
//       toast.error("Text is required!");
//       return;
//     }

//     setLoading(true);
//     const formData = new FormData();
//     formData.append("content", text);
//     if (image) formData.append("image", image);
//     if (video) formData.append("video", video);

//     try {
//       await axiosInstance.post("/posts", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       if (!toastShown) {
//         toast.success("Post created successfully!");
//         setToastShown(true);

//         // Reset flag after a short delay to allow next post
//         setTimeout(() => {
//           setToastShown(false);
//         }, 3000);
//       }

//       // Clear form fields
//       setText("");
//       setImage(null);
//       setImagePreview(null);
//       setVideo(null);
//       setVideoPreview(null);
//     } catch (error) {
//       toast.error("Error creating post. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="h-52 w-full flex justify-center pt-2 bg-white text-black dark:bg-black dark:text-white border-gray-200 dark:border-gray-700">
//       <div className="bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-md w-full max-w-lg p-4 space-y-3">
//         <form onSubmit={handleSubmit} className="space-y-3">
//           <div className="flex items-start gap-3">
//             <img
//               src={profileImage}
//               alt="Profile"
//               className="w-12 h-12 rounded-full object-cover"
//             />
//             <textarea
//               value={text}
//               onChange={handleTextChange}
//               placeholder="What's on your mind?"
//               rows="2"
//               className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-black dark:text-white rounded-md p-2 text-sm resize-none focus:outline-none focus:ring-2"
//             />
//           </div>

//           <div className="flex items-center justify-between">
//             <label className="cursor-pointer text-gray-600 dark:text-gray-300 flex items-center gap-2 text-sm">
//               <ImagePlus size={18} />
//               <span>Image</span>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 className="hidden"
//               />
//             </label>

//             <label className="cursor-pointer text-gray-600 dark:text-gray-300 flex items-center gap-2 text-sm">
//               <ImagePlus size={18} />
//               <span>Video</span>
//               <input
//                 type="file"
//                 accept="video/*"
//                 onChange={handleVideoChange}
//                 className="hidden"
//               />
//             </label>

//             {/* Optional PDF input, if needed in future */}
//             {/* <label className="cursor-pointer text-gray-600 dark:text-gray-300 flex items-center gap-2 text-sm">
//               <FileText size={18} />
//               <span>PDF</span>
//               <input type="file" accept="application/pdf" onChange={handlePdfChange} className="hidden" />
//             </label> */}

//             {imagePreview && (
//               <div className="relative w-10 h-10">
//                 <img
//                   src={imagePreview}
//                   alt="Preview"
//                   className="w-10 h-10 object-cover rounded-md border"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setImage(null);
//                     setImagePreview(null);
//                   }}
//                   className="absolute -top-1 -right-1 bg-blue-500 hover:bg-blue-600 rounded-full p-0.5 text-white"
//                 >
//                   <X size={12} />
//                 </button>
//               </div>
//             )}

//             {videoPreview && (
//               <div className="relative w-14 h-14">
//                 <video
//                   src={videoPreview}
//                   className="w-14 h-14 object-cover rounded-md border"
//                   controls
//                 />
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setVideo(null);
//                     setVideoPreview(null);
//                   }}
//                   className="absolute -top-1 -right-1 bg-blue-500 hover:bg-blue-600 rounded-full p-0.5 text-white"
//                 >
//                   <X size={12} />
//                 </button>
//               </div>
//             )}
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full flex justify-center items-center gap-2 text-white font-semibold text-sm py-2.5 px-4 rounded-md transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
//               loading
//                 ? "bg-blue-300 cursor-not-allowed"
//                 : "bg-blue-400 hover:bg-blue-500 cursor-pointer"
//             }`}
//           >
//             {loading ? (
//               <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
//             ) : (
//               "Post"
//             )}
//           </button>
//         </form>
//       </div>

//       {/* <ToastContainer position="top-right" autoClose={3000} /> */}
//     </div>
//   );
// };

// export default PostCreatorPage;


import React, { useState, useEffect } from "react";
import axiosInstance from "../../config/axios";
import defaultImg from "../assests/default.png";
import { X, ImagePlus, FileText } from "lucide-react";

const PostCreatorPage = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(defaultImg);
  const [video, setVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [toastShown, setToastShown] = useState(false); // Prevent duplicate success toasts

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("User token not found!");
          return;
        }

        const response = await axiosInstance.get("/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = response.data;
        if (user.profilePicture) {
          setProfileImage(user.profilePicture);
        }
      } catch (error) {
        alert("Couldn't load profile image");
      }
    };

    fetchUserData();
  }, []);

  const handleTextChange = (e) => setText(e.target.value);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedImage = e.target.files[0];
      setImage(selectedImage);
      setImagePreview(URL.createObjectURL(selectedImage));
    }
  };

  const handleVideoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedVideo = e.target.files[0];
      setVideo(selectedVideo);
      setVideoPreview(URL.createObjectURL(selectedVideo));
    }
  };

  const handlePdfChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPdf(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text) {
      alert("Text is required!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("content", text);
    if (image) formData.append("image", image);
    if (video) formData.append("video", video);

    try {
      await axiosInstance.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Show alert after successful post creation
      alert("Post created successfully!");

      // Clear form fields
      setText("");
      setImage(null);
      setImagePreview(null);
      setVideo(null);
      setVideoPreview(null);
    } catch (error) {
      alert("Error creating post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-52 w-full flex justify-center pt-2 bg-white text-black dark:bg-black dark:text-white border-gray-200 dark:border-gray-700">
      <div className="bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-md w-full max-w-lg p-4 space-y-3">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-start gap-3">
            <img
              src={profileImage}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover"
            />
            <textarea
              value={text}
              onChange={handleTextChange}
              placeholder="What's on your mind?"
              rows="2"
              className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-black dark:text-white rounded-md p-2 text-sm resize-none focus:outline-none focus:ring-2"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="cursor-pointer text-gray-600 dark:text-gray-300 flex items-center gap-2 text-sm">
              <ImagePlus size={18} />
              <span>Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            <label className="cursor-pointer text-gray-600 dark:text-gray-300 flex items-center gap-2 text-sm">
              <ImagePlus size={18} />
              <span>Video</span>
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="hidden"
              />
            </label>

            {imagePreview && (
              <div className="relative w-10 h-10">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-10 h-10 object-cover rounded-md border"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                  }}
                  className="absolute -top-1 -right-1 bg-blue-500 hover:bg-blue-600 rounded-full p-0.5 text-white"
                >
                  <X size={12} />
                </button>
              </div>
            )}

            {videoPreview && (
              <div className="relative w-14 h-14">
                <video
                  src={videoPreview}
                  className="w-14 h-14 object-cover rounded-md border"
                  controls
                />
                <button
                  type="button"
                  onClick={() => {
                    setVideo(null);
                    setVideoPreview(null);
                  }}
                  className="absolute -top-1 -right-1 bg-blue-500 hover:bg-blue-600 rounded-full p-0.5 text-white"
                >
                  <X size={12} />
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center gap-2 text-white font-semibold text-sm py-2.5 px-4 rounded-md transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-400 hover:bg-blue-500 cursor-pointer"
            }`}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            ) : (
              "Post"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostCreatorPage;
