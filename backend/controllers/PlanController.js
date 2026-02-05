const MembershipPlan = require('../model/MembershipPlan');

exports.createPlan = async (req, res) => {
	try {
		const { name, durationInMonths, price, description, features } = req.body;
		if (!name || !durationInMonths || !price || !features) {
			return res.status(400).json({
				success: false,
				message: 'Name , duration and price are required',
			});
		}
		const plan = await MembershipPlan.create({
			name,
			durationInMonths,
			price,
			features,
			description,
		});
		res.status(201).json({
			success: true,
			message: 'Membership is created',
			plan,
		});
	} catch (e) {
		res.status(500).json({ success: false, message: e.message });
	}
};
exports.getAllPlans = async (req, res) => {
	try {
		const plans = await MembershipPlan.find({ isActive: true }).sort({ createdAt: -1 });
		res.json({
			success: true,
			data: plans,
		});
	} catch (e) {
		res.status(500).json({
			success: false,
			message: e.message,
		});
	}
};

exports.updatePlan = async (req, res) => {
	try {
		const { id } = req.params;
		if (!id) {
			return res.status(400).json({
				success: false,
				message: 'planID is required',
			});
		}
		const plan = await MembershipPlan.findByIdAndUpdate(id, req.body, { new: true });
		if (!plan) {
			return res.status(404).json({
				success: false,
				message: 'plan not found',
			});
		}
		res.json({ success: true, message: 'plan updated' });
	} catch (e) {
		res.status(500).json({
			success: false,
			message: e.message,
		});
	}
};
exports.deletePlan = async (req, res) => {
	try {
		const { id } = req.params;

		const plan = await MembershipPlan.findByIdAndUpdate(id, { isActive: false }, { new: true });

		if (!plan) {
			return res.status(404).json({ success: false, message: 'Plan not found' });
		}

		res.json({ success: true, message: 'Plan disabled' });
	} catch (e) {
		res.status(500).json({ success: false, message: e.message });
	}
};
