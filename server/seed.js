const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");
const dotenv   = require("dotenv");
dotenv.config();

const User  = require("./models/User.model");
const Issue = require("./models/Issue.model");

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB");

  // Clear existing data
  await User.deleteMany();
  await Issue.deleteMany();
  console.log("🗑️  Cleared existing data");

  // Create users
  const users = await User.insertMany([
    { name: "Citizen Priya",  email: "citizen@demo.com",  password: await bcrypt.hash("demo1234", 10), role: "citizen"  },
    { name: "Officer Ravi",   email: "official@demo.com", password: await bcrypt.hash("demo1234", 10), role: "official" },
    { name: "Admin Kumar",    email: "admin@demo.com",    password: await bcrypt.hash("demo1234", 10), role: "admin"    },
    { name: "Kavitha S",      email: "kavitha@demo.com",  password: await bcrypt.hash("demo1234", 10), role: "citizen"  },
    { name: "Murugan V",      email: "murugan@demo.com",  password: await bcrypt.hash("demo1234", 10), role: "citizen"  },
  ]);
  console.log(`👥 Created ${users.length} users`);

  const [citizen1, , , citizen2, citizen3] = users;

  // Create issues
  const issues = await Issue.insertMany([
    {
      title: "Broken Street Light on MG Road",
      description: "Street light has been broken for 2 weeks causing accidents at night near the bus stop.",
      category: "Electricity", priority: "Urgent", status: "Pending",
      location: { address: "MG Road, Block 4, Near Bus Stop", lat: 11.0168, lng: 76.9558 },
      upvotes: [citizen2._id, citizen3._id],
      reportedBy: citizen1._id,
      comments: [{ user: citizen2._id, name: "Kavitha S", text: "Very dangerous at night! Please fix ASAP." }],
    },
    {
      title: "Large Pothole Near Bus Stand",
      description: "Large pothole causing vehicle damage and accidents near the main bus stand. Multiple vehicles have been damaged.",
      category: "Road", priority: "High", status: "In Progress",
      location: { address: "Bus Stand, Main Street, Coimbatore", lat: 11.0215, lng: 76.9725 },
      upvotes: [citizen1._id, citizen3._id],
      reportedBy: citizen2._id,
      comments: [{ user: citizen3._id, name: "Murugan V", text: "Already reported twice! Still not fixed." }],
    },
    {
      title: "Water Pipeline Leakage",
      description: "Main pipeline is leaking continuously for 3 days causing major water wastage and road damage.",
      category: "Water", priority: "Normal", status: "Resolved",
      location: { address: "Gandhi Nagar, Street 7, Block B", lat: 11.0300, lng: 76.9600 },
      upvotes: [citizen1._id],
      reportedBy: citizen3._id,
      comments: [{ user: citizen1._id, name: "Citizen Priya", text: "This was fixed! Thank you." }],
    },
    {
      title: "Garbage Not Collected for 5 Days",
      description: "Garbage has not been collected for 5 days creating serious health hazard near residential area.",
      category: "Sanitation", priority: "Urgent", status: "Pending",
      location: { address: "Anna Nagar, Block B, Street 3", lat: 11.0090, lng: 76.9480 },
      upvotes: [citizen1._id, citizen2._id, citizen3._id],
      reportedBy: citizen2._id,
      comments: [
        { user: citizen1._id, name: "Citizen Priya", text: "Terrible smell! Kids play area is affected." },
        { user: citizen3._id, name: "Murugan V", text: "This is a health emergency." },
      ],
    },
    {
      title: "Park Benches Damaged",
      description: "Multiple benches in the central park are broken and unsafe for elderly citizens.",
      category: "Public Property", priority: "Low", status: "Pending",
      location: { address: "Central Park, East Gate, RS Puram", lat: 11.0050, lng: 76.9550 },
      upvotes: [],
      reportedBy: citizen1._id,
      comments: [],
    },
    {
      title: "Sewage Overflow on Main Road",
      description: "Sewage is overflowing onto the main road creating extremely unhygienic conditions near the market.",
      category: "Sanitation", priority: "Urgent", status: "In Progress",
      location: { address: "Main Road, Near Temple, Gandhipuram", lat: 11.0180, lng: 76.9640 },
      upvotes: [citizen1._id, citizen2._id],
      reportedBy: citizen3._id,
      comments: [{ user: citizen2._id, name: "Officer Ravi", text: "Team has been dispatched. Will be resolved by tomorrow." }],
    },
    {
      title: "Electricity Pole Leaning Dangerously",
      description: "Electric pole is leaning at a dangerous angle after last week's storm and could fall anytime.",
      category: "Electricity", priority: "Urgent", status: "In Progress",
      location: { address: "Nehru Street, Block 2, Peelamedu", lat: 11.0250, lng: 76.9810 },
      upvotes: [citizen3._id],
      reportedBy: citizen2._id,
      comments: [],
    },
    {
      title: "Road Divider Damaged",
      description: "Road divider near the school was broken by a vehicle accident and is now a safety hazard for students.",
      category: "Road", priority: "Normal", status: "Pending",
      location: { address: "School Road, Near Govt School, Singanallur", lat: 11.0010, lng: 77.0100 },
      upvotes: [citizen1._id],
      reportedBy: citizen1._id,
      comments: [],
    },
  ]);

  console.log(`📋 Created ${issues.length} issues`);
  console.log("\n🎉 Seed complete! Demo accounts:");
  console.log("   Citizen  → citizen@demo.com  / demo1234");
  console.log("   Official → official@demo.com / demo1234");
  console.log("   Admin    → admin@demo.com    / demo1234");

  mongoose.disconnect();
};

seed().catch(err => { console.error(err); mongoose.disconnect(); });
