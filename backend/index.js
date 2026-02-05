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

const paymentRoutes = require('./routes/payment');
app.use('/api/payments', paymentRoutes);

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const planRoutes = require('./routes/Plan');
app.use('/api/membership-plan', planRoutes);

const trainerRoutes = require('./routes/trainer');
app.use('/api/trainers', trainerRoutes);

const memberRoutes = require('./routes/member');
app.use('/api/members', memberRoutes);

const port = process.env.PORT || 3000;

app.listen(port, async () => {
	await connectDB();
	console.log(` App started on port ${port}`);
});
