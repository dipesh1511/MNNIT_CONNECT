import User from "../models/userModel.js";
import Message from "../models/messageModel.js";

export const getUserForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // Get only connected users, assuming you have a `connections` field in User model
    const loggedInUser = await User.findById(loggedInUserId).populate("connections", "-password");

    res.status(200).json(loggedInUser.connections);
  } catch (error) {
    console.error("Error in getUserForSidebar:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 }); // Sort messages in ascending order

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
    });

    await newMessage.save();

    res.status(201).json(newMessage); // ✅ Return the saved message
  } catch (error) {
    console.error("Error in sendMessage:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
