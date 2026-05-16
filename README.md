# 🏘️ CivicTrack — Smart Community Issue Tracker

A full-stack web application for citizens to report, track, and resolve community issues.
Built with **React.js + Node.js + Express.js + MongoDB**.

---

## 🗂️ Project Structure

```
community-issue-tracker/
├── client/                      ← React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx       ← Sidebar + navigation
│   │   │   ├── Layout.css
│   │   │   ├── IssueCard.jsx    ← Issue card component
│   │   │   ├── IssueCard.css
│   │   │   ├── UI.jsx           ← Shared UI components
│   │   │   └── UI.css
│   │   ├── context/
│   │   │   └── AuthContext.jsx  ← JWT auth state
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AllIssues.jsx
│   │   │   ├── IssueDetail.jsx
│   │   │   ├── ReportIssue.jsx
│   │   │   ├── MyIssues.jsx
│   │   │   ├── Analytics.jsx
│   │   │   └── AdminUsers.jsx
│   │   ├── services/
│   │   │   └── api.js           ← Axios API calls
│   │   ├── App.jsx
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
│
├── server/                      ← Node.js Backend
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── issue.controller.js
│   │   └── analytics.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js   ← JWT + Role check
│   ├── models/
│   │   ├── User.model.js
│   │   └── Issue.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── issue.routes.js
│   │   ├── user.routes.js
│   │   └── analytics.routes.js
│   ├── uploads/                 ← Photo uploads folder
│   ├── seed.js                  ← Database seeder
│   ├── server.js
│   ├── .env
│   └── package.json
│
├── package.json                 ← Root (concurrently)
└── README.md
```

---

## ⚙️ Prerequisites

Make sure these are installed on your system:

| Tool       | Version  | Download |
|------------|----------|----------|
| Node.js    | v18+     | https://nodejs.org |
| MongoDB    | v6+      | https://www.mongodb.com/try/download/community |
| VS Code    | Latest   | https://code.visualstudio.com |
| Git        | Latest   | https://git-scm.com |

---

## 🚀 Setup Instructions (VS Code)

### Step 1 — Open Project in VS Code
```
Open VS Code → File → Open Folder → Select "community-issue-tracker"
```

### Step 2 — Open Terminal in VS Code
```
Terminal → New Terminal  (or Ctrl + ` )
```

### Step 3 — Install Root Dependencies
```bash
npm install
```

### Step 4 — Install Client Dependencies
```bash
cd client
npm install
cd ..
```

### Step 5 — Install Server Dependencies
```bash
cd server
npm install
cd ..
```

### Step 6 — Start MongoDB
Make sure MongoDB is running on your system:
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
# OR
mongod
```

### Step 7 — Configure Environment
The `.env` file is already set up at `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/community_issue_tracker
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

### Step 8 — Create Uploads Folder
```bash
mkdir server/uploads
```

### Step 9 — Seed the Database (Demo Data)
```bash
cd server
node seed.js
cd ..
```

### Step 10 — Run the Project
Open **two terminals** in VS Code:

**Terminal 1 — Start Backend:**
```bash
cd server
npm run dev
```
You should see:
```
✅ MongoDB Connected
🚀 Server running on http://localhost:5000
```

**Terminal 2 — Start Frontend:**
```bash
cd client
npm start
```
Browser opens at **http://localhost:3000** ✅

---

## 🔐 Demo Login Credentials

| Role     | Email               | Password  |
|----------|---------------------|-----------|
| Citizen  | citizen@demo.com    | demo1234  |
| Official | official@demo.com   | demo1234  |
| Admin    | admin@demo.com      | demo1234  |

---

## ✨ Features by Role

### 👤 Citizen
- Register & Login
- Report new issues with photo + location
- View & filter all issues
- Upvote urgent issues
- Add comments
- Track personal issues

### 🏛️ Official
- View all issues
- Update issue status (Pending → In Progress → Resolved)
- Add comments/updates
- View analytics dashboard

### ⚙️ Admin
- All citizen + official features
- Manage all users (change roles, activate/deactivate)
- Full analytics with Recharts charts

---

## 📡 API Endpoints

| Method | Endpoint                     | Access         |
|--------|------------------------------|----------------|
| POST   | /api/auth/register           | Public         |
| POST   | /api/auth/login              | Public         |
| GET    | /api/auth/me                 | Protected      |
| GET    | /api/issues                  | Protected      |
| POST   | /api/issues                  | Citizen/Admin  |
| GET    | /api/issues/:id              | Protected      |
| PUT    | /api/issues/:id/status       | Official/Admin |
| POST   | /api/issues/:id/upvote       | Protected      |
| POST   | /api/issues/:id/comment      | Protected      |
| DELETE | /api/issues/:id              | Owner/Admin    |
| GET    | /api/analytics/summary       | Protected      |
| GET    | /api/analytics/category      | Protected      |
| GET    | /api/analytics/monthly       | Protected      |
| GET    | /api/analytics/top-upvoted   | Protected      |
| GET    | /api/users                   | Admin only     |
| PUT    | /api/users/:id               | Admin only     |

---

## 🛠️ Tech Stack

| Layer      | Technology                     |
|------------|--------------------------------|
| Frontend   | React.js 18, React Router v6   |
| Styling    | Pure CSS with CSS Variables    |
| Charts     | Recharts                       |
| HTTP       | Axios                          |
| Toast      | React Hot Toast                |
| Backend    | Node.js, Express.js            |
| Database   | MongoDB, Mongoose              |
| Auth       | JWT, bcryptjs                  |
| Upload     | Multer                         |
| Dev Tools  | Nodemon, Concurrently          |

---

## 🧩 VS Code Recommended Extensions

Install these from VS Code Extensions panel:
- **ES7+ React/Redux/React-Native snippets** — rafce shortcut
- **Prettier — Code formatter** — auto format
- **MongoDB for VS Code** — view database
- **Thunder Client** — test API endpoints
- **GitLens** — Git visualization

---

## 🐞 Troubleshooting

**Port 5000 already in use:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
kill -9 $(lsof -ti:5000)
```

**MongoDB connection error:**
- Make sure MongoDB service is running
- Check MONGO_URI in server/.env

**npm install fails:**
```bash
npm cache clean --force
npm install
```

---

## 📄 Project Info

- **Student Name:** [Your Name]
- **Register No:**  [Your Reg No]
- **Course:**       MCA — Alagappa University Distance Education
- **Project:**      Smart Community Issue Tracker
- **Year:**         2025–2026
