const razorpay = require('../utils/razorpay');
const Payment = require('../model/Payment');
const crypto = require('crypto');
const axios = require("axios");

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
      gateway: 'OFFLINE',   // ✅ FIXED
      method: 'CASH',       // ✅ FIXED
      amount,
      status: 'SUCCESS',
      transactionId: 'CASH-' + Date.now(),
      paidAt: new Date()
    });

    res.json({ success: true, payment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Payment save failed' });
  }
};

exports.verifyAndSavePayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      invoiceId,
      amount,
      method
    } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.PAY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

  const payment = await Payment.create({
  invoiceId,
  memberId: req.body.memberId, // ✅ ADD THIS
  gateway: 'RAZORPAY',
  method,
  amount,
  status: 'SUCCESS',
  transactionId: razorpay_payment_id,
  paidAt: new Date()
});


    res.json({ success: true, payment });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Payment verification failed' });
  }
};

exports.createPhonePePayment = async (req, res) => {
  try {
    const { invoiceId, amount, memberId } = req.body;

    const merchantTransactionId = "MT" + Date.now();

    const payload = {
      merchantId: process.env.PHONEPE_MERCHANT_ID,
      merchantTransactionId,
      merchantUserId: memberId,
      amount: amount * 100,
      redirectUrl: process.env.PHONEPE_REDIRECT_URL,
      redirectMode: "REDIRECT",
      callbackUrl: process.env.PHONEPE_CALLBACK_URL,
      paymentInstrument: { type: "PAY_PAGE" }
    };

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64");

    const stringToSign =
      base64Payload + "/pg/v1/pay" + process.env.PHONEPE_SALT_KEY;

    const checksum =
      crypto.createHash("sha256").update(stringToSign).digest("hex") +
      "###" + process.env.PHONEPE_SALT_INDEX;

    const response = await axios.post(
      `${process.env.PHONEPE_BASE_URL}/pg/v1/pay`,
      { request: base64Payload },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": checksum
        }
      }
    );
console.log({
  merchantId: process.env.PHONEPE_MERCHANT_ID,
  saltKey: process.env.PHONEPE_SALT_KEY,
  saltIndex: process.env.PHONEPE_SALT_INDEX
});

    res.json({
      success: true,
      redirectUrl: response.data.data.instrumentResponse.redirectInfo.url,
      merchantTransactionId
    });
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ success: false, message: "PhonePe init failed" });
  }
};

exports.phonepeCallback = async (req, res) => {
  try {
    const { data, code } = req.body;

    await Payment.create({
      invoiceId: data.merchantTransactionId, // OR map from DB
      memberId: data.merchantUserId,
      gateway: "PHONEPE",
      method: "UPI",
      amount: data.amount / 100,
      status: code === "PAYMENT_SUCCESS" ? "SUCCESS" : "FAILED",
      transactionId: data.transactionId,
      paidAt: new Date()
    });

    res.send("OK");
  } catch (err) {
    console.error(err);
    res.status(500).send("Callback error");
  }
};



