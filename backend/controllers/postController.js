import postModel from "../models/postModel.js";
import userModel from "../models/userModel.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";
//get feed possts



export const getFeedPosts = async (req, res) => {
  try {
    const posts = await postModel
      .find({
        $and: [
          { user: { $ne: req.user._id } },
          { user: { $ne: null } }
        ]
      })
      .populate("user", "name username profilePicture bio image video file")
      .populate("comments.user", "name profilePicture image video file")
      .sort({ createdAt: -1 })
      .limit(30);

    const postIds = posts.map(post => post._id.toString());

    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};



export const createPost = async (req, res) => {
  try {
    const content = req.body.content;
    const imageFile = req.files['image'] ? req.files['image'][0] : null; // Get image file
    const videoFile = req.files['video'] ? req.files['video'][0] : null; // Get video file
    const pdf = req.files['pdf'] ? req.files['pdf'][0] : null; // Get other file (if any)

    let newPost;
    let imageUrl = null;
    let videoUrl = null;
    let pdfurl = null;

    if (imageFile) {
      const result = await uploadOnCloudinary(imageFile.path);
      imageUrl = result.secure_url; // Get the secure URL from Cloudinary
    }

    if (videoFile) {
      const result = await uploadOnCloudinary(videoFile.path);
      // console.log('Cloudinary result for video:', result);
      videoUrl = result.secure_url; // Get the secure URL from Cloudinary
    }

    if (pdf) {
      // Handle other file uploads as needed (e.g., documents)
      // console.log('Uploading other file to Cloudinary...');
      const result = await uploadOnCloudinary(pdf.path);
      //  console.log('Cloudinary result for other file:', result);
      pdfurl = result.secure_url; // Get the secure URL from Cloudinary
    }

    newPost = await postModel.create({
      user: req.user._id,
      content,
      image: imageUrl,  // Store image URL
      video: videoUrl,  // Store video URL
      file: pdfurl,  // Store other file URL
    });

    // console.log('Post created:', newPost);

    await userModel.findByIdAndUpdate(req.user._id, {
      $push: { posts: newPost._id },
    });

    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } 
  catch (error) {
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
};



// Get all posts
export const getAllPosts = async (req, res) => {
  try {
    //console.log(req.user.connections);
    const posts = await postModel
      .find({ user: { $in: req.user.connections } })
      .populate("user", "name username profilePicture bio")
      .populate("comments.user", "name profilePicture")
      // .select("content image likes comments")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    //console.log("error in getfeedposts controller: ", error);
    res.status(500).json({ message: "server error" });
  }
};

export const getPostsByUsername = async (req, res) => {
  try {
    const username = req.params.username;
   // console.log("Username:", username);
    const user = await userModel.findOne({ username });
   // console.log("User found:", user);
    
    if (!user) 
      {
        //console.log("user not found");
      return res.status(404).json({ message: "User not found" });
    }
    const posts = await postModel
      .find({ user: user._id })
      .populate("user", "name username profilePicture headline ")
      .populate("comments.user", "name profilePicture username headline")
      .sort({ createdAt: -1 });


    res.status(200).json({ success: true, posts });
    // console.log("Posts fetched successfully:", posts);
  } catch (error) {
    console.error("Error in getPostsByUsername controller:", error);
    res
      .status(500)
      .json({ message: "Error fetching posts", error: error.message });
  }
};


// Delete a post
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    // jiski post hai vhi banda post ko delete kar rha hai ya nahi??
    if (post.user.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "you are not authorized to delete the post" });
    }
    // cloudinary s image ko bhi delete krna if post contains it!
    if (post.imagePublicId) {
      await cloudinary.uploader.destroy(post.imagePublicId);
    }
    await postModel.findByIdAndDelete(postId);
    res
      .status(200)
      .json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting post", error: error.message });
  }
};
// Like/Unlike a post
export const likePost = async (req, res) => {
  try {
    // console.log("ha backend s bol rha hu");
    const postId = req.params.id;
    const userId = req.user._id; // Assumes the user ID is available in req.user

    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      post.likes = post.likes.filter((id) => !id.equals(userId));
    } else {
      post.likes.push(userId);
    }
    await post.save();
    res.json({
      message: isLiked ? "Like removed" : "Post liked",
      likesCount: post.likes.length,
    });
  } catch (error) {
    console.error("Error in likePost:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const addComment = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id;
  const { text } = req.body;

  try {
    // backend s bat kr rha h apun
    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment text is required" });
    }

    // Find the post by ID
    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const newComment = {
      text,
      user: userId,
    };
    post.comments.push(newComment);

    await post.save();

    await post.populate("comments.user", "name profilePicture");

    const addedComment = post.comments[post.comments.length - 1];

    res.status(201).json({
      message: "Comment added successfully",
      comment: addedComment,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
