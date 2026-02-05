const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { addMembership, getMemberMembership } = require('../controllers/membershipController');
router.post('/members/:id/membership', addMembership);
router.get('/members/:id/membership', getMemberMembership);

module.exports = router;
