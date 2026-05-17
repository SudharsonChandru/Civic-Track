const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

// ── Middleware ──────────────────────────────
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Routes ──────────────────────────────────
app.use("/api/auth",      require("./routes/auth.routes"));
app.use("/api/issues",    require("./routes/issue.routes"));
app.use("/api/users",     require("./routes/user.routes"));
app.use("/api/analytics", require("./routes/analytics.routes"));

// ── Health Check ────────────────────────────
app.get("/", (req, res) => res.json({ message: "Community Issue Tracker API Running ✅" }));

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
