const jwt = require("jsonwebtoken");

exports.generateAccessToken = (admin) =>
  jwt.sign(
    { id: admin._id, email: admin.email },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

exports.generateRefreshToken = (admin) =>
  jwt.sign(
    { id: admin._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
