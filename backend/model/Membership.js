const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema(
	{
		memberId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Member',
			required: true,
		},
		planId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'MembershipPlan',
			required: true,
		},
		startDate: {
			type: Date,
			required: true,
		},
		endDate: {
			type: Date,
			required: true,
			index: true,
		},
		pausedAt: Date,
		cancelledAt: Date,
		status: {
			type: String,
			enum: ['active', 'pending_payment', 'paused', 'expired', , 'cancelled'],
			default: 'active',
		},
		personalTrainer: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'PersonalTrainer',
			default: null,
		},
		// model/Membership.js
invoiceId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Invoice',
},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Membership', membershipSchema);
//status can be updated automatically based on endDate using a cron job or middleware.
