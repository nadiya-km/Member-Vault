const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema(
	{
		invoiceNumber: {
			type: String,
			required: true,
			unique: true,
		},
		memberId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Member',
			required: true,
		},
		membershipId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Membership',
		},

		amount: {
			type: Number,
			required: true,
		},
		status: {
			type: String,
			enum: ['PENDING', 'PAID', 'CANCELLED'],
			default: 'PENDING',
		},
		paymentId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Payment',
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Invoice', invoiceSchema);
