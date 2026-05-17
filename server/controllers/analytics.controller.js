const Issue = require("../models/Issue.model");

// @GET /api/analytics/summary
const getSummary = async (req, res) => {
  try {
    const total      = await Issue.countDocuments();
    const pending    = await Issue.countDocuments({ status: "Pending" });
    const inProgress = await Issue.countDocuments({ status: "In Progress" });
    const resolved   = await Issue.countDocuments({ status: "Resolved" });
    const urgent     = await Issue.countDocuments({ priority: "Urgent" });
    res.json({ total, pending, inProgress, resolved, urgent });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/analytics/category
const getByCategory = async (req, res) => {
  try {
    const data = await Issue.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/analytics/monthly
const getMonthly = async (req, res) => {
  try {
    const data = await Issue.aggregate([
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/analytics/top-upvoted
const getTopUpvoted = async (req, res) => {
  try {
    const data = await Issue.aggregate([
      { $addFields: { upvoteCount: { $size: "$upvotes" } } },
      { $sort: { upvoteCount: -1 } },
      { $limit: 5 },
      { $project: { title: 1, category: 1, status: 1, upvoteCount: 1 } },
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getSummary, getByCategory, getMonthly, getTopUpvoted };
