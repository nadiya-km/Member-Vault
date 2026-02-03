const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
	{
		invoiceId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Invoice',
			required: true,
		},

		memberId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Member',
			required: true,
		},

		gateway: {
			type: String,
			enum: ['RAZORPAY', 'PHONEPE', 'STRIPE', 'OFFLINE'],
			required: true,
		},

		method: {
			type: String,
			enum: ['UPI', 'CARD', 'NET_BANKING', 'CASH', 'BANK_TRANSFER'],
			required: true,
		},

		amount: {
			type: Number,
			required: true,
		},

		status: {
			type: String,
			enum: ['SUCCESS', 'FAILED', 'PENDING'],
			default: 'PENDING',
		},

		transactionId: {
			type: String,
			required: function () {
				return this.gateway !== 'OFFLINE';
			},
		},

		paidAt: Date,
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
