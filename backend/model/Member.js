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
		personalTrainer: {
			name: String,
			phone: String,
		},
		status: {
			type: String,
			enum: ['active', 'inactive'],
			default: 'active',
		},
		secretKey: {
			type: String,
			required: true,
			index: true,
			unique: true,
		},
	},
	{ timestamps: true }
);
//Auto generate secretKey
memberSchema.pre('save', function (next) {
	if (!this.secretKey) {
		this.secretKey = crypto.randomBytes(32).toString('hex');
	}
	next();
});
//Admin secretKey regeneration method
memberSchema.methods.regenerateSecretKey = function () {
	this.secretKey = crypto.randomBytes(32).toString('hex');
	return this.secretKey;
};
module.exports = mongoose.model('Member', memberSchema);
