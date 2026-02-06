const Membership = require('../model/Membership');
const MembershipPlan = require('../model/MembershipPlan');
const Invoice = require('../model/Invoice');
const Payment = require('../model/Payment');

exports.addMembership = async (req, res) => {
	try {
		const { id } = req.params;
		const { planId, personalTrainer, paymentType } = req.body;

		if (!['CASH', 'ONLINE'].includes(paymentType)) {
			return res.status(400).json({
				success: false,
				message: 'Invalid payment type',
			});
		}

		const plan = await MembershipPlan.findById(planId);
		if (!plan) {
			return res.status(404).json({
				success: false,
				message: 'Plan not found',
			});
		}

		// Find current active membership
		const activeMembership = await Membership.findOne({
			memberId: id,
			status: 'active',
		}).sort({ endDate: -1 });

		let startDate = new Date();
		let status = 'active';

		if (activeMembership) {
			// Schedule after current plan
			startDate = new Date(activeMembership.endDate);
			startDate.setDate(startDate.getDate() + 1);
			status = 'scheduled';
		}

		const endDate = new Date(startDate);
		endDate.setMonth(endDate.getMonth() + plan.durationInMonths);

		const membership = await Membership.create({
			memberId: id,
			planId,
			startDate,
			endDate,
			status: paymentType === 'ONLINE' ? 'pending_payment' : status,
			personalTrainer: personalTrainer || null,
			paymentType,
		});

		const invoice = await Invoice.create({
			invoiceNumber: `INV-${Date.now()}`,
			memberId: id,
			membershipId: membership._id,
			amount: plan.price,
			paymentMethod: paymentType,
			status: paymentType === 'CASH' ? 'PAID' : 'PENDING',
		});

		membership.invoiceId = invoice._id;
		await membership.save();

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

		res.status(201).json({
			success: true,
			message: activeMembership
				? 'Membership scheduled successfully'
				: 'Membership activated successfully',
			data: membership,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			success: false,
			message: 'Failed to add membership',
		});
	}
};
exports.getMemberMembership = async (req, res) => {
	try {
		const membership = await Membership.findOne({
			memberId: req.params.id,
		})
			.sort({ startDate: -1 })
			.populate('planId')
			.populate('personalTrainer');

		res.json({
			success: true,
			data: membership || null,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			success: false,
			message: 'Failed to fetch membership',
		});
	}
};

exports.getMembershipHistory = async (req, res) => {
	try {
		const { id } = req.params;

		const history = await Membership.find({ memberId: id })
			.populate('planId')
			.sort({ createdAt: -1 });

		res.status(200).json({
			success: true,
			data: history,
		});
	} catch (error) {
		console.error('Membership history error:', error);
		res.status(500).json({
			success: false,
			message: 'Failed to fetch membership history',
		});
	}
};

exports.editMembership = async (req, res) => {
	try {
		const { endDate, personalTrainer, status } = req.body;

		const membership = await Membership.findOne({
			memberId: req.params.id,
		}).sort({ startDate: -1 });
		if (!membership) {
			return res.status(404).json({ message: 'Membership not found' });
		}

		// prevent editing expired memberships
		if (membership.status === 'expired') {
			return res.status(400).json({
				message: 'Cannot edit expired membership',
			});
		}

		membership.endDate = endDate;
		membership.personalTrainer = personalTrainer || null;
		membership.status = status;

		await membership.save();

		res.json({
			success: true,
			data: membership,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			success: false,
			message: 'Failed to update membership',
		});
	}
};
