const razorpay = require('../utils/razorpay');
const Payment = require('../model/Payment');
const crypto = require('crypto');
const axios = require("axios");
const Membership = require('../model/Membership');


// paymentController.js (TOP of file)
const normalizePaymentMethod = (rawMethod = "") => {
  switch (rawMethod.toLowerCase()) {
    case "upi":
      return "UPI";

    case "card":
    case "credit_card":
    case "debit_card":
      return "CARD";

    case "netbanking":
    case "net_banking":
      return "NET_BANKING";

    case "bank_transfer":
      return "BANK_TRANSFER";

    case "cash":
      return "CASH";

    default:
      return "UPI"; 
  }
};

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

};

exports.verifyAndSavePayment = async (req, res) => {
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

exports.createCashfreeOrder = async (req, res) => {
  try {
    const { invoiceId, amount, memberId } = req.body;

    const orderId = `INV_${invoiceId}_${Date.now()}`;

    const response = await axios.post(
      "https://sandbox.cashfree.com/pg/orders",
      {
        order_id: orderId,
        order_amount: amount,
        order_currency: "INR",
        customer_details: {
          customer_id: memberId,
          customer_email: "test@email.com",
          customer_phone: "9999999999",
        },
        order_meta: {
          return_url: `http://localhost:5173/payment/${invoiceId}?order_id=${orderId}`,
        },
      },
      {
        headers: {
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_SECRET,
          "x-api-version": "2023-08-01",
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      success: true,
      payment_session_id: response.data.payment_session_id,
      orderId,
    });
  } catch (err) {
   
    res.status(500).json({
      success: false,
      message: err.response?.data?.message || "Cashfree order failed",
    });
  }
};
exports.verifyCashfreePayment = async (req, res) => {
  try {
    const { orderId, invoiceId, memberId, amount } = req.body;
    console.log(req.body)
    const verify = await axios.get(
      `https://sandbox.cashfree.com/pg/orders/${orderId}`,
      {
        headers: {
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_SECRET,
          "x-api-version": "2023-08-01",
        },
      }
    );

    if (verify.data.order_status !== "PAID") {
      return res.status(400).json({ success: false, message: "Payment not completed" });
    }

   const cfRawMethod =
  verify.data.payments?.[0]?.payment_method ||
  verify.data.payments?.[0]?.payment_method_type ||
  "";

const normalizedMethod = normalizePaymentMethod(cfRawMethod);

const payment = await Payment.create({
  invoiceId,
  memberId,
  paymentType: "ONLINE",
  gateway: "CASHFREE",
  method: normalizedMethod, // ✅ ENUM SAFE
  amount,
  status: "SUCCESS",
  transactionId:
    verify.data.payments?.[0]?.cf_payment_id || orderId,
  paidAt: new Date(),
});

    await Membership.findOneAndUpdate(
      { invoiceId },
      { status: "active", paidAt: new Date(), amountPaid: amount }
    );

    res.json({ success: true, payment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Cashfree verification failed" });
  }
};