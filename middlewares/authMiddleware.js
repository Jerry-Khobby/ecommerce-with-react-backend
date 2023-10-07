const User = require("../models/userdata");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.userVerification = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ status: false });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (user) {
      req.user = user; // Attach user object to the request for further use in the route
      next(); // Call next() to proceed to the next middleware or route handler
    } else {
      return res.json({ status: false });
    }
  } catch (error) {
    return res.json({ status: false });
  }
};
