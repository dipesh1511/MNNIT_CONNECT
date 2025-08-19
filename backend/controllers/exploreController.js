import userModel from "../models/userModel.js";
import connectionRequestModel from "../models/connectionRequestModel.js";
// GET suggested connections (not already connected and not self)
const getSuggestedConnections = async (req, res) => {
  try {
    const currentUser = await userModel
      .findById(req.user._id)
      .select("connections")
      .lean();

    if (!currentUser) {
      return res.status(404).json({ success: false, message: "Current user not found." });
    }

    // Find all pending requests involving the current user
    const pendingRequests = await connectionRequestModel.find({
      $or: [
        { sender: req.user._id, status: "pending" },
        { receiver: req.user._id, status: "pending" },
      ],
    }).lean();

    // Collect user IDs involved in pending requests
    const pendingUserIds = pendingRequests.flatMap(req => [
      req.sender.toString(),
      req.receiver.toString(),
    ]);

    // Build exclusion list
    const excludedUsers = new Set([
      req.user._id.toString(),
      ...currentUser.connections.map(id => id.toString()),
      ...pendingUserIds,
    ]);

    // Fetch suggestions
    const suggestedUsers = await userModel
      .find({
        _id: { $nin: Array.from(excludedUsers) },
      })
      .select("name username profilePicture bio branch batch program")
      .limit(5)
      .lean();

    res.json({ success: true, data: suggestedUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// GET a user profile by username (for /explore/:username)
const exploreProfile = async (req, res) => {
  try {
    const user = await userModel
      .findOne({ username: req.params.username })
      .select("-password")
      .lean();

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

export { getSuggestedConnections, exploreProfile };
