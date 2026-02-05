const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createPlan,updatePlan, deletePlan, getAllPlans,  } = require('../controllers/PlanController');

router
	.route('/')
	.post(auth, createPlan)
	.get(getAllPlans);
    
router
.route('/:id')
.put(auth, updatePlan)
.delete(auth, deletePlan);



module.exports=router