const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
	addMembership,
	getMemberMembership,
	editMembership,
    getMembershipHistory,
} = require('../controllers/membershipController');

router.post('/:id/membership', auth, addMembership);
router.get('/:id/membership', auth, getMemberMembership);
router.put('/:id/membership', auth, editMembership);
router.get('/:id/membership/history', auth, getMembershipHistory);

module.exports = router;
