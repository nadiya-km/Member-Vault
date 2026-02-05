const Membership = require('../model/Membership');

exports.addMembership = async (req, res) => {
	try {
		const { id } = req.params;
		const { planId, startDate, endDate, personalTrainer } = req.body;
		const existing = await Membership.findOne({
			memberId: id,
			status: 'active',
		});

		if (existing) {
			return res.status(400).json({
				message: 'Active membership already exists',
			});
		}

		const membership = await Membership.create({
			memberId: id,
			planId,
			startDate,
			endDate,
			status: 'active',
			personalTrainer: personalTrainer || null,
		});

		res.status(201).json({
			success: true,
			data: membership,
		});
	} catch (err) {
		res.status(500).json({
			success: false,
			message: 'Failed to add membership',
		});
	}
};
exports.getMemberMembership = async (req, res) => {
	let membership = await Membership.findOne({
		memberId: req.params.id,
		status: 'active',
	})
		.populate('planId')
		.populate('personalTrainer');

	if (!membership) {
		return res.json({ data: null });
	}

	// expiry check
	if (new Date(membership.endDate) < new Date()) {
		membership.status = 'expired';
		await membership.save();
		return res.json({ data: null });
	}

	res.json({ data: membership });
};