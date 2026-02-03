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
		status: {
			type: String,
			enum: ['active', 'expired'],
			default: 'active',
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Membership', membershipSchema);
//status can be updated automatically based on endDate using a cron job or middleware.