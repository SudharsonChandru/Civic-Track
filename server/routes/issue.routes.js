const express  = require("express");
const router   = express.Router();
/*  const multer   = require("multer");
const path     = require("path");*/

const { upload } = require("../config/cloudinary");

const { protect, authorize } = require("../middleware/auth.middleware");
const {
  getIssues, getIssueById, createIssue,
  updateStatus, upvoteIssue, addComment, deleteIssue,
} = require("../controllers/issue.controller");

/*

// Multer config for photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename:    (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    cb(null, allowed.test(path.extname(file.originalname).toLowerCase()));
  },
});
*/
router.get("/",              protect, getIssues);
router.get("/:id",           protect, getIssueById);
router.post("/",             protect, upload.single("photo"), createIssue);
router.put("/:id/status",    protect, authorize("official", "admin"), updateStatus);
router.post("/:id/upvote",   protect, upvoteIssue);
router.post("/:id/comment",  protect, addComment);
router.delete("/:id",        protect, deleteIssue);
router.put("/:id",           protect, updateIssue);

module.exports = router;
