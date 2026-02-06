const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const { createMember, getMembers, getMemberDetails,getDashboard } = require('../controllers/memberController');

router.get('/dashboard', auth, getDashboard);


router.post('/', auth, createMember);
router.get('/', auth, getMembers);
router.get('/:id', auth, getMemberDetails);



module.exports = router;
