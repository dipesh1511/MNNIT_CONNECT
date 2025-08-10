// import React from "react";
// import Feedposts from "../components/feedposts.jsx";
// import { useSelector } from "react-redux";
// import PostCreator from "../components/PostCreator.jsx";
// const Home = () => {
//   const { token } = useSelector((state) => state.auth);
//   return (
//     <div className="pt-16">
//       <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white flex justify-center px-4">
//         <div className="w-full max-w-6xl flex flex-col md:flex-row gap-6">
//           <div className="block md:hidden w-full"> <PostCreator /> </div>
//           <div className="w-full md:w-2/3">  <Feedposts />  </div>
//           <div className="hidden md:block w-1/3 h-fit sticky top-20">  <PostCreator />  </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default Home;


import React, { useState } from "react";
import PostCreator from "../components/PostCreator";
import Feedposts from "../components/Feedposts";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const [postCreated, setPostCreated] = useState(false);

  const handlePostCreated = () => {
    setPostCreated(true);
  };

  React.useEffect(() => {
    if (postCreated) {
      toast.success("✅ Post created successfully!");
      setPostCreated(false);  // Reset state after toast is shown
    }
  }, [postCreated]);

  return (
    <div className="pt-16">
      <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white flex justify-center px-4">
        <div className="w-full max-w-6xl flex flex-col md:flex-row gap-6">
          <div className="block md:hidden w-full">
            <PostCreator onPostCreated={handlePostCreated} />
          </div>

          <div className="w-full md:w-2/3">
            <Feedposts />
          </div>

          <div className="hidden md:block w-1/3 h-fit sticky top-20">
            <PostCreator onPostCreated={handlePostCreated} />
          </div>
        </div>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </div>
  );
};

export default Home;
