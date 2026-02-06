const razorpay = require('../utils/razorpay');
const Payment = require('../model/Payment');
const crypto = require('crypto');
const axios = require("axios");
const Membership = require('../model/Membership');

exports.createOrder = async (req, res) => {
  try {
    const { amount, invoiceId } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: `inv_${invoiceId}`
    });

    res.json({
      success: true,
      order
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Order creation failed' });
  }
};

exports.savePayment = async (req, res) => {
  try {
    const { invoiceId, amount, method, memberId } = req.body;

   const payment = await Payment.create({
  invoiceId,
  memberId,
  paymentType: 'CASH',   // ✅ ADD THIS
  gateway: 'OFFLINE',
  method: 'CASH',
  amount,
  status: 'SUCCESS',
  transactionId: 'CASH-' + Date.now(),
  paidAt: new Date()
});
    await Membership.findOneAndUpdate(
  { invoiceId },
  {
    status: 'active',
    paidAt: new Date(),
    amountPaid: amount,
  }
);

    res.json({ success: true, payment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Payment save failed' });
  }

};exports.verifyAndSavePayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      invoiceId,
      memberId,
      amount,
      method,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.PAY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid Razorpay signature",
      });
    }

    // Save payment
   const payment = await Payment.create({
  invoiceId,
  memberId,
  paymentType: 'ONLINE', // ✅ ADD THIS
  gateway: "RAZORPAY",
  method,
  amount,
  status: "SUCCESS",
  transactionId: razorpay_payment_id,
  orderId: razorpay_order_id,
  paidAt: new Date(),
});
    // 🔥 ACTIVATE MEMBERSHIP
    await Membership.findOneAndUpdate(
      { invoiceId },
      {
        status: 'active',
        paidAt: new Date(),
        amountPaid: amount,
      }
    );

    return res.json({
      success: true,
      message: "Payment completed. Membership activated 🎉",
      payment,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error during payment verification",
    });
  }
};