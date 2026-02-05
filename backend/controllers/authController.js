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

    // ✅ SAVE refresh token
    admin.refreshToken = refreshToken;
    await admin.save();

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
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken)
    return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const admin = await Admin.findById(decoded.id);
    if (!admin || admin.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(admin);

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).json({ message: "Refresh token expired" });
  }
};

exports.logoutAdmin = async (req, res) => {
  await Admin.findByIdAndUpdate(req.admin.id, {
    refreshToken: null,
  });

  res.json({ success: true, message: "Logged out successfully" });
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
