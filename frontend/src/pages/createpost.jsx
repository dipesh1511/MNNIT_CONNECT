import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../config/axios";

const CreatePostPage = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleTextChange = (e) => setText(e.target.value);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedImage = e.target.files[0];
      setImage(selectedImage);
      setImagePreview(URL.createObjectURL(selectedImage));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text) {
      toast.error("Text is necessary!", { progress: undefined });
      return;
    }

    const formData = new FormData();
    formData.append("content", text);
    if (image) formData.append("image", image);

    try {
      await axiosInstance.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Post created successfully!");
      setText("");
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      toast.error("Error creating post. Please try again.");
    }
  };

  return (
    <div className="pt-16">
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white flex items-center justify-center p-6">
      <div className="bg-gray-50 dark:bg-gray-900 shadow-lg rounded-lg w-full max-w-lg p-8 space-y-6 transition duration-300 transform hover:scale-105">
        <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400 text-center mb-4">
          Create a New Post
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={text}
            onChange={handleTextChange}
            placeholder="Share your thoughts..."
            rows="5"
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400"
          ></textarea>

          <div>
            <label className="block text-gray-600 dark:text-gray-300 mb-2">
              Upload Image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 rounded-lg p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            />
            {imagePreview && (
              <div className="mt-4 relative">
                <img
                  src={imagePreview}
                  alt="Selected Preview"
                  className="w-full h-48 object-cover rounded-lg shadow-md"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                  }}
                  className="absolute top-2 right-2 text-white bg-red-500 p-1 rounded-full hover:bg-red-600"
                >
                  X
                </button>
              </div>
            )}
          </div>

          <button   type="submit"   className="w-full bg-blue-600 dark:bg-blue-500 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-700 dark:hover:bg-blue-400 transition" >    Post  </button>
        </form>
      </div>

      <ToastContainer position="top-right" autoClose={3000} progressBar />
    </div>
    </div>
  );
};

export default CreatePostPage;
