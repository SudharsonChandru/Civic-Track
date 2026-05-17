const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

// ── Middleware ──────────────────────────────
app.use(cors({
  origin: [
    "http://localhost:3000",                      // local development
    "https://https://civictrack-sudharson-mcaproject.netlify.app"           // ← your Netlify URL
  ],
  credentials: true
}));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Routes ──────────────────────────────────
app.use("/api/auth",      require("./routes/auth.routes"));
app.use("/api/issues",    require("./routes/issue.routes"));
app.use("/api/users",     require("./routes/user.routes"));
app.use("/api/analytics", require("./routes/analytics.routes"));

// ── Health Check ────────────────────────────
app.get("/", (req, res) => res.json({ message: "Community Issue Tracker API Running ✅" }));

// ── Temporary Seed Route ─────────────────────
app.get("/api/seed", async (req, res) => {
  try {
    const User  = require("./models/User.model");
    const Issue = require("./models/Issue.model");
    const bcrypt = require("bcryptjs");

    // Clear existing
    await User.deleteMany();
    await Issue.deleteMany();

    // Create users
    const users = await User.insertMany([
      { name: "Citizen Priya",  email: "citizen@demo.com",  password: await bcrypt.hash("demo1234", 10), role: "citizen"  },
      { name: "Officer Ravi",   email: "official@demo.com", password: await bcrypt.hash("demo1234", 10), role: "official" },
      { name: "Admin Kumar",    email: "admin@demo.com",    password: await bcrypt.hash("demo1234", 10), role: "admin"    },
    ]);

    const [c1, , c3] = users;

    // Create sample issues
    await Issue.insertMany([
      {
        title: "Broken Street Light on MG Road",
        description: "Street light broken for 2 weeks causing accidents at night.",
        category: "Electricity", priority: "Urgent", status: "Pending",
        location: { address: "MG Road, Block 4", lat: 11.0168, lng: 76.9558 },
        upvotes: [], comments: [], reportedBy: c1._id,
      },
      {
        title: "Large Pothole Near Bus Stand",
        description: "Large pothole causing vehicle damage near the main bus stand.",
        category: "Road", priority: "High", status: "In Progress",
        location: { address: "Bus Stand, Main Street", lat: 11.0215, lng: 76.9725 },
        upvotes: [], comments: [], reportedBy: c1._id,
      },
      {
        title: "Water Pipeline Leakage",
        description: "Main pipeline leaking continuously wasting water.",
        category: "Water", priority: "Normal", status: "Resolved",
        location: { address: "Gandhi Nagar, Street 7", lat: 11.0300, lng: 76.9600 },
        upvotes: [], comments: [], reportedBy: c3._id,
      },
      {
        title: "Garbage Not Collected for 5 Days",
        description: "Garbage not collected creating serious health hazard.",
        category: "Sanitation", priority: "Urgent", status: "Pending",
        location: { address: "Anna Nagar, Block B", lat: 11.0090, lng: 76.9480 },
        upvotes: [], comments: [], reportedBy: c1._id,
      },
    ]);

    res.json({
      success: true,
      message: "✅ Database seeded successfully!",
      accounts: {
        citizen:  { email: "citizen@demo.com",  password: "demo1234" },
        official: { email: "official@demo.com", password: "demo1234" },
        admin:    { email: "admin@demo.com",     password: "demo1234" },
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── MongoDB Connection ───────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(process.env.PORT, () =>
      console.log(`🚀 Server running on http://localhost:${process.env.PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB Error:", err));