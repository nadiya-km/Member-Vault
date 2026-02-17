const mongoose = require("mongoose");
const Invoice = require("../model/Invoice");
const Member = require("../model/Member");
const Payment = require("../model/Payment");

exports.getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid invoice ID" });
    }

    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const member = await Member
      .findById(invoice.memberId)
      .select("+secretKey");

    res.json({ success: true, invoice, member });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Invoice fetch failed" });
  }
};

exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate('memberId', 'name email phone')
      .sort({ createdAt: -1 });

    // Self-healing: Update PENDING invoices if a successful payment exists
    const updatedInvoices = await Promise.all(invoices.map(async (inv) => {
      if (inv.status === 'PENDING') {
        const successPayment = await Payment.findOne({
          invoiceId: inv._id,
          status: 'SUCCESS'
        });

        if (successPayment) {
          inv.status = 'PAID';
          await Invoice.findByIdAndUpdate(inv._id, { status: 'PAID' });
        }
      }
      return inv;
    }));

    res.json({ success: true, data: updatedInvoices });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch invoices" });
  }
};