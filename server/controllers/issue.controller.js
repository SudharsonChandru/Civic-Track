const Issue = require("../models/Issue.model");

// @GET /api/issues
const getIssues = async (req, res) => {
  try {
    const { category, status, priority, search } = req.query;
    const filter = {};
    if (category && category !== "All") filter.category = category;
    if (status   && status   !== "All") filter.status   = status;
    if (priority && priority !== "All") filter.priority = priority;
    if (search) filter.title = { $regex: search, $options: "i" };

    const issues = await Issue.find(filter)
      .populate("reportedBy", "name email")
      .populate("assignedTo",  "name email")
      .sort({ createdAt: -1 });

    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/issues/:id
const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate("reportedBy", "name email")
      .populate("assignedTo",  "name email");
    if (!issue) return res.status(404).json({ message: "Issue not found" });
    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/issues
const createIssue = async (req, res) => {
  try {
    const { title, description, category, priority, location } = req.body;
    if (!title || !description || !category || !location)
      return res.status(400).json({ message: "Please fill all required fields" });

    const photo = req.file ? `/uploads/${req.file.filename}` : "";
    const issue = await Issue.create({
      title, description, category,
      priority: priority || "Normal",
      location: typeof location === "string" ? JSON.parse(location) : location,
      photo,
      reportedBy: req.user._id,
    });
    res.status(201).json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/issues/:id/status
const updateStatus = async (req, res) => {
  try {
    const { status, assignedTo } = req.body;
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    if (status)     issue.status     = status;
    if (assignedTo) issue.assignedTo = assignedTo;
    await issue.save();
    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/issues/:id/upvote
const upvoteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    const idx = issue.upvotes.indexOf(req.user._id);
    if (idx === -1) {
      issue.upvotes.push(req.user._id);
    } else {
      issue.upvotes.splice(idx, 1);
    }
    await issue.save();
    res.json({ upvotes: issue.upvotes.length, upvoted: idx === -1 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/issues/:id/comment
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Comment text required" });

    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    issue.comments.push({ user: req.user._id, name: req.user.name, text });
    await issue.save();
    res.json(issue.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @DELETE /api/issues/:id
const deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });
    if (issue.reportedBy.toString() !== req.user._id.toString() && req.user.role !== "admin")
      return res.status(403).json({ message: "Not authorized" });

    await issue.deleteOne();
    res.json({ message: "Issue deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getIssues, getIssueById, createIssue, updateStatus, upvoteIssue, addComment, deleteIssue };
