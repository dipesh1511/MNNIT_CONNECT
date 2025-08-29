import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: { 
      type: String, 
      enum: ['MNNIT Campus Related', 'Interview Related'],
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  { timestamps: true }
);

const Experience = mongoose.model('Experience', experienceSchema);

export default Experience;
