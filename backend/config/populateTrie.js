import userModel from "../models/userModel.js";
import { Trie } from "../utils/tries.js";

export const nameTrie = new Trie();
export const skillTrie = new Trie();
export const titleTrie = new Trie();
export const locationTrie = new Trie();
export const branchTrie = new Trie();  
export const batchTrie = new Trie();   
export const programTrie = new Trie(); 
 
export const populateTries = async () => {
  try {
    const users = await userModel.find({}, "name skills title location branch batch program");

    users.forEach((user) => {
      nameTrie.insert(user.name, user._id.toString());
      if (user.skills) {
        user.skills.forEach((skill) =>
          skillTrie.insert(skill, user._id.toString())
        );
      }
      if (user.title) {
        titleTrie.insert(user.title, user._id.toString());
      }
      if (user.location) {
        locationTrie.insert(user.location, user._id.toString());
      }
      if (user.branch) { // Insert branch if available
        branchTrie.insert(user.branch, user._id.toString());
      }
      if (user.batch) { // Insert batch if available
        batchTrie.insert(user.batch, user._id.toString());
      }
      if (user.program) { // Insert program if available
        programTrie.insert(user.program, user._id.toString());
      }
    });

    console.log("Tries populated successfully with user data.");
  } catch (error) {
    console.error("Error populating tries:", error);
  }
};
