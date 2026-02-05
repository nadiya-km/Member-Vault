const mongoose = require('mongoose');

const membershipPlanSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		durationInMonths: {
			type: Number,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		features: [
			{
				type: String,
				trim: true,
			},
		],
		isActive: {
			type: Boolean,
			default: true,
		},
		description: {
			type: String,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('MembershipPlan', membershipPlanSchema);
