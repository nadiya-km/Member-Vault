const crypto = require('crypto');

const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		phone: {
			type: String,
			required: true,
		},
		whatsappNumber: {
			type: String,
			required: true,
			trim: true,
		},
		age: {
			type: Number,
		},
		status: {
			type: String,
			enum: ['active', 'inactive'],
			default: 'active',
		},
		secretKey: {
			type: String,
			index: true,
			unique: true,
			select: false,
		},
	},
	{ timestamps: true }
);
//Auto generate secretKey
memberSchema.pre('save', function (next) {
	if (!this.secretKey) {
		this.secretKey = crypto.randomBytes(32).toString('hex');
	}
});
//Admin secretKey regeneration method
memberSchema.methods.regenerateSecretKey = function () {
	this.secretKey = crypto.randomBytes(32).toString('hex');
	return this.secretKey;
};
module.exports = mongoose.model('Member', memberSchema);
