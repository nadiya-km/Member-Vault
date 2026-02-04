const express = require("express");
const router = express.Router();

const { loginAdmin, logoutAdmin } = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");

router.post("/login", loginAdmin);             
router.post("/logout", authMiddleware, logoutAdmin); 

module.exports = router;
