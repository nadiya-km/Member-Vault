const express = require("express");
const router = express.Router();

const { loginAdmin, logoutAdmin,refreshToken } = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");

router.post("/login", loginAdmin);  
router.post("/refresh", refreshToken);
router.post("/logout", authMiddleware, logoutAdmin); 

module.exports = router;
