const express = require("express");
const router = express.Router();

const {
  createOrder,
  savePayment,
  verifyAndSavePayment,
  createCashfreeOrder,
  verifyCashfreePayment,
} = require("../controllers/paymentController");

/* 🔓 PUBLIC PAYMENT ROUTES */
router.post("/create-order", createOrder);
router.post("/verify-payment", verifyAndSavePayment);

router.post("/cashfree/create-order", createCashfreeOrder);
router.post("/cashfree/verify", verifyCashfreePayment);

/* 🔒 ADMIN CASH */
router.post("/save-payment", savePayment);

module.exports = router;