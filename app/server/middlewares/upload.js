import multer from 'multer';
import cloudinary from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary (v1 syntax)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = 'uploads';
    let resource_type = 'auto';
    let allowed_formats = [];

    if (file.fieldname === 'profilePic') {
      folder = 'uploads/profiles';
      allowed_formats = ['jpg', 'png', 'jpeg'];
    } else if (file.fieldname === 'resumeUrl') {
      folder = 'uploads/resumes';
      resource_type = 'raw'; // For PDFs and documents
      allowed_formats = ['pdf', 'doc', 'docx'];
    }

    return {
      folder: folder,
      resource_type: resource_type,
      allowed_formats: allowed_formats,
      public_id: `${file.fieldname}-${Date.now()}`,
    };
  },
});

const fileFilter = (req, file, cb) => {
  // Allow images for profilePic
  if (file.fieldname === 'profilePic') {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG and PNG images are allowed for profile picture'), false);
    }
  }
  // Allow documents for resumeUrl
  else if (file.fieldname === 'resumeUrl') {
    const allowedMimes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed for resume'), false);
    }
  } else {
    cb(new Error('Invalid file field'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export default upload;