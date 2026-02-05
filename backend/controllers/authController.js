const Admin = require("../model/Admin");
const bcrypt = require("bcryptjs");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/jwt");

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin)
      return res.status(401).json({ success: false, message: "Invalid email" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: "Invalid password" });

    const accessToken = generateAccessToken(admin);
    const refreshToken = generateRefreshToken(admin);

    res.json({
      success: true,
      accessToken,
      refreshToken,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err.message);
  res.status(500).json({ success: false, message: err.message });
  }
};


exports.logoutAdmin = async (req, res) => {
  try {
    return res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Logout failed" });
  }
};
// exports.loginAdmin = async (req, res) => {
// 	const { email, password } = req.body;

// 	const admin = await Admin.findOne({ email }).select('+password');
// 	if (!admin) {
// 		return res.status(401).json({ message: 'Invalid credentials' });
// 	}

// 	const isMatch = await bcrypt.compare(password, admin.password);
// 	if (!isMatch) {
// 		return res.status(401).json({ message: 'Invalid credentials' });
// 	}

// 	const accessToken = generateAccessToken(admin);
// 	const refreshToken = generateRefreshToken(admin);

// 	admin.refreshToken = refreshToken;
// 	await admin.save();

// 	res.json({
// 		success: true,
// 		accessToken,
// 		refreshToken,
// 	});
// };
