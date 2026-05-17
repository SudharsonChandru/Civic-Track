const cloudinary = require("cloudinary");
const CloudinaryStorage = require("multer-storage-cloudinary");
const multer = require("multer");

// Configure Cloudinary v1 style (for multer-storage-cloudinary v2)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Storage
const storage = new CloudinaryStorage({
  cloudinary:      cloudinary,
  folder:          "civic-track",
  allowedFormats:  ["jpg", "jpeg", "png", "webp"],
  transformation:  [{ width: 800, height: 600, crop: "limit" }],
});

const upload = multer({ storage });

module.exports = { cloudinary, upload };