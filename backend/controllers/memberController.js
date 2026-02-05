const Member = require('../model/Member');
const Membership = require('../model/Membership');


exports.createMember = async (req, res) => {
	try {
		const { name, email, phone, whatsappNumber, age, personalTrainer } = req.body;

		if (!name || !email || !phone || !whatsappNumber) {
			return res.status(400).json({
				success: false,
				message: 'Required fields missing',
			});
		}

		const member = await Member.create({
			name,
			email,
			phone,
			whatsappNumber,
			age,
			personalTrainer,
		});

		res.status(201).json({
			success: true,
			data: member,
		});
	} catch (err) {
		if (err.code === 11000) {
			return res.status(400).json({
				success: false,
				message: 'Email already exists',
			});
		}
		res.status(500).json({ success: false, message: err.message });
	}
};
exports.getMembers = async (req, res) => {
	try {
		const members = await Member.find({ status: 'active' })
			.populate('personalTrainer', 'name specialization')
			.sort({ createdAt: -1 });

		res.json({
			success: true,
			data: members,
		});
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
};
exports.getMemberDetails = async (req, res) => {
	try {
		const member = await Member.findById(req.params.id).populate(
			'personalTrainer',
			'name specialization'
		);

		if (!member) {
			return res.status(404).json({ success: false, message: 'Member not found' });
		}

		const membership = await Membership.findOne({
			memberId: member._id,
			status: 'active',
		}).populate('planId');

		res.json({
			success: true,
			data: {
				member,
				membership, // can be null
			},
		});
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
};
