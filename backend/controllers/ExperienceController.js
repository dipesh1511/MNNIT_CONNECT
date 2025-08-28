import Experience from '../models/ExperiencePostModel.js';
import User from '../models/userModel.js';

export const createExperience = async (req, res) => {
  console.log("Inside createExperience function");
  console.log("req.body is:", req.body);
  try {
    const { title, content, category } = req.body;
    console.log("title is:", title);
    console.log("content is:", content);
    console.log("category is:", category);

    if (!title || !content || !category) {
      return res.status(400).json({ message: 'Title, content, and category are required' });
    }


    const userId = req.user._id;
    console.log("userId is:", userId);
    const newExperience = await Experience.create({ 
      title, 
      content, 
      category,  
      user: req.user._id 
    });
    

    const populatedExperience = await newExperience.populate('user', 'fullName');


    res.status(201).json(populatedExperience);
  } catch (err) {
    console.error('Error creating experience:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllExperiences = async (req, res) => {
  try {
   
    const posts = await Experience.find()
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json({ posts });
    
  } catch (err) {
    console.error('Error fetching experiences:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
