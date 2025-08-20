import userModel from "../models/userModel.js";
import {
  nameTrie,
  skillTrie,
  titleTrie,
  locationTrie,
  branchTrie,  
  batchTrie,  
  programTrie  
} from "../config/populateTrie.js";

export const searchUsers = async (req, res) => {
  try {
    const { query, field, page = 1, pageSize = 10, mode = "prefix" } = req.query;

    if (!query || !field) {
      return res.status(400).json({ error: "Query and field are required" });
    }
  
    let userIds;


    const trieMap = {
      name: nameTrie,
      skills: skillTrie,
      title: titleTrie,
      location: locationTrie,
      branch: branchTrie,  
      batch: batchTrie,   
      program: programTrie 
    };

    const trie = trieMap[field];
    if (!trie) {
      return res.status(400).json({ error: "Invalid search field" });
    }

    // Apply prefix or contains mode
    userIds = mode === "contains"
      ? trie.getAllMatching(query)
      : trie.searchPrefix(query);
  
    const matchedUserIds = Array.from(userIds);
    const totalResults = matchedUserIds.length;

    // Paginate results
    const paginatedIds = matchedUserIds.slice(
      (page - 1) * pageSize,
      page * pageSize
    );

    const users = await userModel.find({ _id: { $in: paginatedIds } }).lean();

    const userMap = new Map(users.map(user => [user._id.toString(), user]));
    const orderedUsers = paginatedIds.map(id => userMap.get(id.toString())).filter(Boolean);

    res.json({ users: orderedUsers, totalResults });

  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Server error" });
  }
};
  