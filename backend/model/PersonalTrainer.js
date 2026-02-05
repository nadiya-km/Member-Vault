const mongoose = require('mongoose');

const personalTrainerSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		phone: {
			type: String,
			required: true,
		},
		specialization: {
			type: String,
		},
		status: {
			type: String,
			enum: ['active', 'inactive'],
			default: 'active',
		},
		experience: { type: Number, required: true },
		pricePerMonth: { type: Number, required: true },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('PersonalTrainer', personalTrainerSchema);
