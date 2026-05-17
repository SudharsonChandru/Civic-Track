const express = require("express");
const router  = express.Router();
const { protect } = require("../middleware/auth.middleware");
const { getSummary, getByCategory, getMonthly, getTopUpvoted } = require("../controllers/analytics.controller");

router.get("/summary",     protect, getSummary);
router.get("/category",    protect, getByCategory);
router.get("/monthly",     protect, getMonthly);
router.get("/top-upvoted", protect, getTopUpvoted);

module.exports = router;
