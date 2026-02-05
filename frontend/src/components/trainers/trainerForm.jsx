import { useState } from 'react';
import { createTrainer } from '../../services/trainerService';

const TrainerForm = ({ onSuccess }) => {
	const [form, setForm] = useState({
		name: '',
		phone: '',
		specialization: '',
		experience: '',
		pricePerMonth: '',
		bio: '',
	});

	const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

const submitHandler = async (e) => {
	e.preventDefault();
	await createTrainer({
		...form,
		experience: Number(form.experience),
		pricePerMonth: Number(form.pricePerMonth),
	});
	setForm({
		name: '',
		phone: '',
		specialization: '',
		experience: '',
		pricePerMonth: '',
		bio: '',
	});
	onSuccess();
};

	return (
		<form className="card p-3 mb-4" onSubmit={submitHandler}>
			<input
				className="form-control mb-2"
				name="name"
				placeholder="Name"
				value={form.name}
				onChange={handleChange}
			/>

			<input
				className="form-control mb-2"
				name="phone"
				placeholder="Phone Number"
				value={form.phone}
				onChange={handleChange}
			/>

			<input
				className="form-control mb-2"
				name="specialization"
				placeholder="Specialization"
				value={form.specialization}
				onChange={handleChange}
			/>

			<input
				className="form-control mb-2"
				type="number"
				name="experience"
				placeholder="Experience (years)"
				value={form.experience}
				onChange={handleChange}
			/>

			<input
				className="form-control mb-2"
				type="number"
				name="pricePerMonth"
				placeholder="Price / month"
				value={form.pricePerMonth}
				onChange={handleChange}
			/>

			<button className="btn btn-success">Save Trainer</button>
		</form>
	);
};

export default TrainerForm;