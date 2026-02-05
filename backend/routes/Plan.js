const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createPlan, getAllPlan, updatePlan, deletePlan } = require('../controllers/PlanController');

router
	.route('/')
	.post(auth, createPlan)
	.get(getAllPlan);
    
router
.route('/:id')
.put(auth, updatePlan)
.delete(auth, deletePlan);

module.exports=router