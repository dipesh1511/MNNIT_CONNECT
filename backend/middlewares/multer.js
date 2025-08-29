import multer from "multer";
import path from "path";

// Set up storage options with disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure the destination exists or handle any errors
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    // Adding a timestamp to avoid filename conflicts
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

// Add a file filter to restrict to images only
const fileFilter = (req, file, cb) => {
  
    //console.log("inside multer");
   // console.log("File type:", file.mimetype); 
    // Check if the file type is allowed
 
    const allowedTypes = [  "image/jpeg",  "image/png",  "image/jpg",  "video/mp4",  "video/webm",  "application/pdf"  ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, JPG, MP4, WEBM videos, and PDF files are allowed"), false);
    }

  };
  


export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // Limit file size to 2MB
  },
  fileFilter: fileFilter,
});
