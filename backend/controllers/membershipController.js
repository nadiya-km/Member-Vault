const Membership = require('../model/Membership');
const MembershipPlan = require('../model/MembershipPlan');
const Invoice = require('../model/Invoice');
const Payment = require('../model/Payment');

exports.addMembership = async (req, res) => {
	try {
		const { id } = req.params;
		const { planId, startDate, endDate, personalTrainer, paymentType } = req.body;

		// Check existing active membership
		const existing = await Membership.findOne({
			memberId: id,
			status: 'active',
		});

		if (existing) {
			return res.status(400).json({
				success: false,
				message: 'Active membership already exists',
			});
		}
		if (!['CASH', 'ONLINE'].includes(paymentType)) {
			return res.status(400).json({
				success: false,
				message: 'Invalid payment type',
			});
		}

		// Get membership plan
		const plan = await MembershipPlan.findById(planId);
		if (!plan) {
			return res.status(404).json({
				success: false,
				message: 'Plan not found',
			});
		}

		//  Create membership
		const membership = await Membership.create({
			memberId: id,
			planId,
			startDate,
			endDate,
			status: paymentType === 'CASH' ? 'active' : 'pending_payment',
			personalTrainer: personalTrainer || null,
			paymentType,
		});

		//  Create invoice
		const invoice = await Invoice.create({
			invoiceNumber: `INV-${Date.now()}`,
			memberId: id,
			membershipId: membership._id,
			amount: plan.price,
			paymentMethod: paymentType,
			status: paymentType === 'CASH' ? 'PAID' : 'PENDING',
		});

		// Create payment record
		await Payment.create({
			invoiceId: invoice._id,
			memberId: id,
			gateway: paymentType === 'CASH' ? 'OFFLINE' : 'RAZORPAY',
			method: paymentType === 'CASH' ? 'CASH' : 'UPI',
			paymentType,
			amount: plan.price,
			status: paymentType === 'CASH' ? 'SUCCESS' : 'PENDING',
			paidAt: paymentType === 'CASH' ? new Date() : null,
		});

		return res.status(201).json({
			success: true,
			message: 'Membership added successfully',
			data: membership,
		});
	} catch (err) {
		console.error(err);
		return res.status(500).json({
			success: false,
			message: 'Failed to add membership',
		});
	}
};

exports.getMemberMembership = async (req, res) => {
	try {
		let membership = await Membership.findOne({
			memberId: req.params.id,
			status: { $in: ['active', 'paused', 'pending_payment'] },
		})
			.populate('planId')
			.populate('personalTrainer');

		if (!membership) {
			return res.json({ data: null });
		}

		// Expiry check
		if (new Date(membership.endDate) < new Date()) {
			membership.status = 'expired';
			await membership.save();
			return res.json({ data: null });
		}

		res.json({ data: membership });
	} catch (err) {
		res.status(500).json({
			success: false,
			message: 'Failed to fetch membership',
		});
	}
};
exports.editMembership = async (req, res) => {
	try {
		const { id } = req.params; // memberId
		const { status, personalTrainer, extendDays, planId, endDate } = req.body;

		const membership = await Membership.findOne({
			memberId: id,
			status: { $in: ['active', 'paused', 'pending_payment'] },
		});
		if (
			membership.status === 'pending_payment' &&
			membership.paymentType === 'ONLINE' &&
			['paused', 'cancelled', 'active'].includes(status)
		) {
			return res.status(400).json({
				success: false,
				message: 'Cannot modify membership until payment is completed',
			});
		}

		if (!membership) {
			return res.status(404).json({
				success: false,
				message: 'Membership not found',
			});
		}

		// Optional: change plan
		if (planId) {
			const plan = await MembershipPlan.findById(planId);
			if (!plan) {
				return res.status(404).json({
					success: false,
					message: 'Plan not found',
				});
			}
			membership.planId = planId;
		}

		if (endDate) membership.endDate = endDate;
		if (personalTrainer !== undefined) membership.personalTrainer = personalTrainer || null;

		// Allow limited status updates
		if (status && ['active', 'paused', 'cancelled'].includes(status)) {
			membership.status = status;
		}
		// Update plan
		if (planId) {
			membership.planId = planId;
		}

		// Admin override end date
		if (endDate) {
			membership.endDate = new Date(endDate);
		}

		await membership.save();

		res.json({
			success: true,
			message: 'Membership updated successfully',
			data: membership,
		});
	} catch (err) {
		console.error('EDIT MEMBERSHIP ERROR:', err);
		res.status(500).json({
			success: false,
			message: 'Failed to update membership',
		});
	}
};
