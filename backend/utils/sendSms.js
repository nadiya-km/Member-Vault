const axios = require('axios');

exports.sendSMS = async ({ phone, message }) => {
	try {
		await axios.post(
			'https://www.fast2sms.com/dev/bulkV2',
			{
				route: 'v3',
				message,
				language: 'english',
				flash: 0,
				numbers: phone,
			},
			{
				headers: {
					authorization: process.env.FAST2SMS_API_KEY,
					'Content-Type': 'application/json',
				},
			}
		);
		console.log('SMS sent to', phone);
	} catch (err) {
		console.error('SMS FAILED:', err.response?.data || err.message);
	}
};
