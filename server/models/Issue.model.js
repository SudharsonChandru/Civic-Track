const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    user:    { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name:    { type: String },
    text:    { type: String, required: true },
  },
  { timestamps: true }
);

const issueSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["Road", "Water", "Electricity", "Sanitation", "Public Property", "Other"],
      required: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Normal", "High", "Urgent"],
      default: "Normal",
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
    },
    location: {
      address: { type: String, required: true },
      lat:     { type: Number, default: 0 },
      lng:     { type: Number, default: 0 },
    },
    photo:      { type: String, default: "" },
    upvotes:    [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments:   [commentSchema],
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Issue", issueSchema);
