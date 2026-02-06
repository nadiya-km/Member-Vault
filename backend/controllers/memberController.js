// controllers/memberController.js
const Member = require('../model/Member');
const Membership = require('../model/Membership');

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

	res.status(201).json({ data: member });
};

exports.getMembers = async (req, res) => {
	const members = await Member.find({ status: 'active' }).sort({ createdAt: -1 });
	res.json({ data: members });
};

exports.getMemberDetails = async (req, res) => {
	const member = await Member.findById(req.params.id);
	if (!member) return res.status(404).json({ message: 'Not found' });

	const membership = await Membership.findOne({
		memberId: member._id,
		status: 'active',
	})
		.populate('planId')
		.populate('personalTrainer');

	res.json({ data: { member, membership } });
};





exports.getDashboard = async (req, res) => {
  try {
    const totalMembers = await Member.countDocuments({
      status: 'active',
    });

    res.json({
      admin: req.admin, 
      totalMembers,
    });
  } catch (error) {
    res.status(500).json({ message: 'Dashboard error' });
  }
};