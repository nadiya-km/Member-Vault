require('dotenv').config();

const express = require('express');
const app = express();
const connectDB = require('./config/db');

app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 5000;

// app.get('/api/testing', (req, res) => {
// 	res.json({ status: 'ok', message: 'backend is connected' });
// });

app.listen(port, async () => {
	await connectDB();
	console.log(` App started on port ${port}`);
});
