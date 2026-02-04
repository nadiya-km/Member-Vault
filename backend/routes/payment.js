const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");

const {createOrder,savePayment,verifyAndSavePayment} = require("../controllers/paymentController");


router.post('/create-order',authMiddleware, createOrder);
router.post('/save-payment',authMiddleware, savePayment);
router.post('/verify-payment',authMiddleware, verifyAndSavePayment);


module.exports = router;
