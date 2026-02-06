const cron = require('node-cron');
const Membership = require('../model/Membership');
const Member = require('../model/Member');
const { sendSMS } = require('../utils/sendSMS');

cron.schedule('0 9 * * *', async () => {
	console.log('⏰ Running membership reminder job');

	const today = new Date();
	const twoDaysLater = new Date();
	twoDaysLater.setDate(today.getDate() + 2);

	// 🔔 2 DAYS BEFORE EXPIRY
	const expiringSoon = await Membership.find({
		status: 'active',
		endDate: {
			$gte: new Date(twoDaysLater.setHours(0, 0, 0, 0)),
			$lt: new Date(twoDaysLater.setHours(23, 59, 59, 999)),
		},
	}).populate('memberId');

	for (let m of expiringSoon) {
		const msg = `Hi ${m.memberId.name},
Your gym membership will expire in 2 days.
Please renew to avoid interruption.
– MemberVault Gym`;

		await sendSMS({
			phone: m.memberId.phone,
			message: msg,
		});
	}

	// ❌ AFTER EXPIRY
	const expired = await Membership.find({
		status: 'active',
		endDate: { $lt: today },
	}).populate('memberId');

	for (let m of expired) {
		m.status = 'expired';
		await m.save();

		const msg = `Hi ${m.memberId.name},
Your gym membership has expired.
Please renew to continue services.
– MemberVault Gym`;

		await sendSMS({
			phone: m.memberId.phone,
			message: msg,
		});
	}
});
