// controllers/memberController.js
const Member = require('../model/Member');
const Membership = require('../model/Membership');
const PersonalTrainer = require('../model/PersonalTrainer');
const { sendEmail } = require('../utils/sendEmail');

exports.createMember = async (req, res) => {
	const { name, email, phone, whatsappNumber, age } = req.body;

	if (!name || !email || !phone || !whatsappNumber) {
		return res.status(400).json({ message: 'Required fields missing' });
	}

	const member = await Member.create({
		name,
		email,
		phone,
		whatsappNumber,
		age,
	});
	const profileLink = `http://localhost:5173/member/profile/${member.secretKey}`;

	await sendEmail({
		to: member.email,
		subject: 'Welcome to Our Gym – Your Profile Access',
		html: `
    <h3>Hi ${member.name} 👋</h3>
    <p>Welcome to our gym!</p>
	<p>Your personal gym profile is ready.</p>
    <p>You can view your profile, membership details, and payments using the link below:</p>
    <a href="${profileLink}" target="_blank">${profileLink}</a>
    <br/><br/>
    <p><strong>Keep this link private.</strong></p>
    <p>– Gym Team </p>
  `,
	});

	res.status(201).json({ data: member });
};

exports.getMembers = async (req, res) => {
	const members = await Member.find({ status: 'active' }).sort({ createdAt: -1 });
	res.json({ data: members });
};

exports.getMemberDetails = async (req, res) => {
	const member = await Member.findById(req.params.id).select('+secretKey');
	if (!member) return res.status(404).json({ message: 'Not found' });

	const membership = await Membership.findOne({
		memberId: member._id,
		status: 'active',
	})
		.populate('planId')
		.populate('personalTrainer');
	const profileLink = `http://localhost:5173/member/profile/${member.secretKey}`;

	res.json({ data: { member, membership, profileLink } });
};
const Invoice = require('../model/Invoice');
const Payment = require('../model/Payment');

exports.getProfileBySecretKey = async (req, res) => {
	const member = await Member.findOne({
		secretKey: req.params.secretKey,
		status: 'active',
	});

	if (!member) {
		return res.status(404).json({ message: 'Profile not found' });
	}

	const membership = await Membership.findOne({
		memberId: member._id,
		status: { $in: ['active', 'paused', 'pending_payment'] },
	})
		.populate('planId')
		.populate('personalTrainer');

	const invoices = await Invoice.find({ memberId: member._id }).sort({ createdAt: -1 });

	// Self-healing: Update PENDING invoices if a successful payment exists
	const updatedInvoices = await Promise.all(invoices.map(async (inv) => {
		if (inv.status === 'PENDING') {
			const successPayment = await Payment.findOne({
				invoiceId: inv._id,
				status: 'SUCCESS'
			});

			if (successPayment) {
				inv.status = 'PAID';
				await Invoice.findByIdAndUpdate(inv._id, { status: 'PAID' });
			}
		}
		return inv;
	}));

	res.json({ success: true, data: { member, membership, invoices: updatedInvoices } });
};

exports.regenerateProfileLink = async (req, res) => {
	const member = await Member.findById(req.params.id).select('+secretKey');

	if (!member) {
		return res.status(404).json({ message: 'Member not found' });
	}

	member.regenerateSecretKey();
	await member.save();

	const profileLink = `http://localhost:5173/member/profile/${member.secretKey}`;

	res.json({
		success: true,
		profileLink,
	});
};
exports.getDashboard = async (req, res) => {
	try {
		const totalMembers = await Member.countDocuments({
			status: 'active',
		});

		const activePlans = await Membership.countDocuments({
			status: 'active',
		});

		const totalTrainers = await PersonalTrainer.countDocuments({
			status: 'active',
		});

		const revenueData = await Invoice.aggregate([
			{ $match: { status: 'PAID' } },
			{ $group: { _id: null, total: { $sum: '$amount' } } }
		]);

		const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

		res.json({
			admin: req.admin,
			totalMembers,
			activePlans,
			totalTrainers,
			totalRevenue,
		});
	} catch (error) {
		console.error('Dashboard error:', error);
		res.status(500).json({ message: 'Dashboard error' });
	}
};


exports.updateMember = async (req, res) => {
	try {
		const { name, email, phone, whatsappNumber, age, status } = req.body;

		const member = await Member.findById(req.params.id);
		if (!member) {
			return res.status(404).json({ message: 'Member not found' });
		}

		// Update fields (only if provided)
		if (name) member.name = name;
		if (email) member.email = email;
		if (phone) member.phone = phone;
		if (whatsappNumber) member.whatsappNumber = whatsappNumber;
		if (age !== undefined) member.age = age;
		if (status) member.status = status;

		await member.save();

		res.json({
			success: true,
			message: 'Member updated successfully',
			data: member,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Failed to update member' });
	}
};
