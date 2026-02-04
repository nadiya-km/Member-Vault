const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");

const {createOrder,savePayment,verifyAndSavePayment,createPhonePePayment,phonepeCallback,} = require("../controllers/paymentController");


router.post('/create-order',authMiddleware, createOrder);
router.post('/save-payment',authMiddleware, savePayment);
router.post('/verify-payment',authMiddleware, verifyAndSavePayment);

router.post("/phonepe/create",authMiddleware, createPhonePePayment);
router.post("/phonepe-callback", phonepeCallback);


module.exports = router;
