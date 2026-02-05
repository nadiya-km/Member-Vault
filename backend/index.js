require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
const connectDB = require('./config/db');

app.use(
	cors({
		origin: 'http://localhost:5173',
		credentials: true,
	})
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// // app.get('/api/testing', (req, res) => {
// // 	res.json({ status: 'ok', message: 'backend is connected' });
// // });


const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const trainerRoutes = require('./routes/trainer');
app.use('/api/trainers', trainerRoutes);

const memberRoutes = require('./routes/member');
app.use('/api/members', memberRoutes);

const membershipRoutes = require('./routes/membership');
app.use('/api', membershipRoutes);

const membershipPlanRoutes = require('./routes/Plan');
app.use('/api/membership-plans', membershipPlanRoutes);

const paymentRoutes = require('./routes/payment');
app.use('/api/payments', paymentRoutes);

const port = process.env.PORT || 3000;

app.listen(port, async () => {
	await connectDB();
	console.log(` App started on port ${port}`);
});
