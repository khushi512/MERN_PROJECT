import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

console.log("✅ Upload middleware initializing...");
console.log("Cloudinary config check:", {
  hasCloudinary: !!cloudinary,
  configExists: !!cloudinary.config
});

// Use single CloudinaryStorage with dynamic params based on fieldname
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    try {
      console.log(`📤 Processing file upload: ${file.fieldname}, mimetype: ${file.mimetype}`);

      if (file.fieldname === "profilePic") {
        console.log("→ Profile picture upload params");
        return {
          folder: "profile_pics",
          allowed_formats: ["jpg", "jpeg", "png"],
        };
      } else if (file.fieldname === "resumeUrl") {
        console.log("→ Resume upload params");
        return {
          folder: "resumes",
          resource_type: "raw",
        };
      } else {
        console.error(`❌ Invalid file field: ${file.fieldname}`);
        throw new Error(`Invalid file field: ${file.fieldname}`);
      }
    } catch (error) {
      console.error("❌ ERROR in params function:", error);
      throw error;
    }
  },
});

console.log("✅ CloudinaryStorage created");

const fileFilter = (req, file, cb) => {
  console.log(`🔍 File filter check: ${file.fieldname}, ${file.mimetype}`);

  // Allow images for profilePic
  if (file.fieldname === 'profilePic') {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedMimes.includes(file.mimetype)) {
      console.log("✅ ProfilePic accepted");
      cb(null, true);
    } else {
      console.log("❌ ProfilePic rejected - invalid type");
      cb(new Error('Only JPG and PNG images are allowed for profile picture'), false);
    }
  }
  // Allow documents for resumeUrl
  else if (file.fieldname === 'resumeUrl') {
    const allowedMimes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedMimes.includes(file.mimetype)) {
      console.log("✅ Resume accepted");
      cb(null, true);
    } else {
      console.log("❌ Resume rejected - invalid type");
      cb(new Error('Only PDF, DOC, and DOCX files are allowed for resume'), false);
    }
  } else {
    console.log(`❌ Invalid field: ${file.fieldname}`);
    cb(new Error('Invalid file field'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

console.log("✅ Multer upload middleware created");

export default upload;
