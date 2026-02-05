const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
	createTrainer,
	getAllTrainers,
	updateTrainer,
	deleteTrainer,
} = require('../controllers/trainerController');

router.route('/').post(auth, createTrainer).get(auth, getAllTrainers);

router.route('/:id').put(auth, updateTrainer).delete(auth, deleteTrainer);

module.exports = router;
