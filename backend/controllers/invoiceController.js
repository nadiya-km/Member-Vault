const Invoice = require('../model/Invoice');
const Member = require('../model/Member');

exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    const member = await Member.findById(invoice.memberId).select('+secretKey');

    res.json({
      success: true,
      invoice,
      member,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Invoice fetch failed' });
  }
};