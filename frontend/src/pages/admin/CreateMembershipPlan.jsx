import { useState } from 'react';
import api from '../../services/api';


const CreateMembershipPlan = () => {
	const [form, setForm] = useState({
		name: '',
		price: '',
		duration: '',
		description: '',
		status: 'active',
	});

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async () => {
		try {
			await api.post('/membership-plans', form);
			alert('Membership plan created');
			setForm({
				name: '',
				price: '',
				duration: '',
				description: '',
				status: 'active',
			});
		} catch (err) {
			alert('Failed to create plan');
		}
	};

	return (
		<>
			<div className="p-4">
				<div className="card p-4">
					<h4>Create Membership Plan</h4>

					<input
						name="name"
						placeholder="Plan Name"
						value={form.name}
						onChange={handleChange}
						className="form-control mb-2"
					/>

					<input
						name="price"
						type="number"
						placeholder="Price"
						value={form.price}
						onChange={handleChange}
						className="form-control mb-2"
					/>

					<input
						name="duration"
						type="number"
						placeholder="Duration (Months)"
						value={form.duration}
						onChange={handleChange}
						className="form-control mb-2"
					/>

					<textarea
						name="description"
						placeholder="Description"
						value={form.description}
						onChange={handleChange}
						className="form-control mb-2"
					/>

					<select
						name="status"
						value={form.status}
						onChange={handleChange}
						className="form-control mb-3"
					>
						<option value="active">Active</option>
						<option value="inactive">Inactive</option>
					</select>

					<button className="btn btn-primary" onClick={handleSubmit}>
						Create Plan
					</button>
				</div>
			</div>
		</>
	);
};

export default CreateMembershipPlan;
