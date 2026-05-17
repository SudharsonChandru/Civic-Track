const express  = require("express");
const mongoose = require("mongoose");
const cors     = require("cors");
const dotenv   = require("dotenv");
const path     = require("path");

dotenv.config();

const app = express();

// ── CORS ─────────────────────────────────────
const allowedOrigins = [
  "http://localhost:3000",
  "https://civic-track-blue.vercel.app",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials:     true,
  methods:         ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders:  ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders:  ["Content-Range", "X-Content-Range"],
  preflightContinue: false,
  optionsSuccessStatus: 200,
}));

// ── Handle Preflight Requests ─────────────────
app.options("*", cors());

// ── Middleware ────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Routes ────────────────────────────────────
app.use("/api/auth",      require("./routes/auth.routes"));
app.use("/api/issues",    require("./routes/issue.routes"));
app.use("/api/users",     require("./routes/user.routes"));
app.use("/api/analytics", require("./routes/analytics.routes"));

// ── Seed Route ────────────────────────────────
app.get("/api/seed", async (req, res) => {
  try {
    const User   = require("./models/User.model");
    const Issue  = require("./models/Issue.model");
    const bcrypt = require("bcryptjs");

    await User.deleteMany();
    await Issue.deleteMany();

    const users = await User.insertMany([
      { name: "Citizen Priya",  email: "citizen@demo.com",  password: await bcrypt.hash("demo1234", 10), role: "citizen"  },
      { name: "Officer Ravi",   email: "official@demo.com", password: await bcrypt.hash("demo1234", 10), role: "official" },
      { name: "Admin Kumar",    email: "admin@demo.com",    password: await bcrypt.hash("demo1234", 10), role: "admin"    },
    ]);

    const [c1, , c3] = users;

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
        title: "Garbage Not Collected for 5 Days",
        description: "Garbage not collected creating serious health hazard.",
        category: "Sanitation", priority: "Urgent", status: "Pending",
        location: { address: "Anna Nagar, Block B", lat: 11.0090, lng: 76.9480 },
        upvotes: [], comments: [], reportedBy: c3._id,
      },
    ]);

    res.json({
      success: true,
      message: "✅ Database seeded!",
      login: {
        citizen:  "citizen@demo.com  / demo1234",
        official: "official@demo.com / demo1234",
        admin:    "admin@demo.com    / demo1234",
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Health Check ──────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "Community Issue Tracker API Running ✅" });
});

// ── MongoDB Connection ────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB Error:", err));