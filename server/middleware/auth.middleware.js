const jwt  = require("jsonwebtoken");
const User = require("../models/User.model");

const protect = async (req, res, next) => {
  let token;
 console.log("Headers:", req.headers.authorization);
  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      // Check user exists
      if (!user)
        return res.status(401).json({ message: "User not found" });

      // ✅ Check if account is still active
      if (!user.isActive)
        return res.status(403).json({ message: "Your account has been deactivated." });

      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return res.status(403).json({ message: `Role '${req.user.role}' is not authorized` });
  next();
};

module.exports = { protect, authorize };