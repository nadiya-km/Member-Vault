const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
	addMembership,
	getMemberMembership,
	editMembership,
} = require('../controllers/membershipController');

router.post('/:id/membership', auth, addMembership);
router.get('/:id/membership', auth, getMemberMembership);
router.put('/members/:id/membership', auth, editMembership);
module.exports = router;
