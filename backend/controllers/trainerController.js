const Trainer = require('../model/PersonalTrainer');

exports.createTrainer = async (req, res) => {
	try {
		const { name, phone, specialization, experience, pricePerMonth, bio } = req.body;

		if (
			!name?.trim() ||
			!phone?.trim() ||
			experience === undefined ||
			pricePerMonth === undefined
		) {
			return res.status(400).json({
				success: false,
				message: 'Required fields missing',
			});
		}

		const trainer = await Trainer.create({
			name,
			phone,
			specialization,
			experience,
			pricePerMonth,
			bio,
		});

		res.status(201).json({ success: true, trainer });
	} catch (e) {
		res.status(500).json({ success: false, message: e.message });
	}
};

exports.getAllTrainers = async (req, res) => {
	try {
		const trainers = await Trainer.find({ status: 'active' }).sort({ createdAt: -1 });
		res.json({ success: true, data: trainers });
	} catch (e) {
		res.status(500).json({ success: false, message: e.message });
	}
};
exports.getActiveTrainers = async (req, res) => {
	const trainers = await PersonalTrainer.find({ status: 'active' });
	res.json(trainers);
};

exports.updateTrainer = async (req, res) => {
	try {
		const trainer = await Trainer.findByIdAndUpdate(req.params.id, req.body, { new: true });
		if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });

		res.json({ success: true, message: 'Trainer updated' });
	} catch (e) {
		res.status(500).json({ success: false, message: e.message });
	}
};

exports.deleteTrainer = async (req, res) => {
	try {
		const trainer = await Trainer.findByIdAndUpdate(
			req.params.id,
			{ status: 'inactive' },
			{ new: true }
		);

		if (!trainer) return res.status(404).json({ success: false, message: 'Trainer not found' });

		res.json({ success: true, message: 'Trainer disabled' });
	} catch (e) {
		res.status(500).json({ success: false, message: e.message });
	}
};
