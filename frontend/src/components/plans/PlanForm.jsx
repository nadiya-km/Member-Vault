import { useState } from 'react';
import { createPlan } from '../../services/planService';

const PlanForm = ({ onSuccess }) => {
	const [form, setForm] = useState({
		name: '',
		durationInMonths: '',
		price: '',
		description: '',
		features: '',
	});

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const submitHandler = async (e) => {
		e.preventDefault();
		try {
			await createPlan(form);
			alert('Plan created successfully');
			setForm({ name: '', durationInMonths: '', price: '', description: '', features: '' });
			onSuccess();
		} catch (err) {
			alert(err.response?.data?.message || 'Failed to create plan');
		}
	};

	return (
		<form onSubmit={submitHandler}>
			<div className="row g-3">
				<div className="col-md-6">
					<label className="form-label">Plan Name</label>
					<input
						type="text"
						name="name"
						className="form-control"
						value={form.name}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="col-md-3">
					<label className="form-label">Duration (Months)</label>
					<input
						type="number"
						name="durationInMonths"
						className="form-control"
						value={form.durationInMonths}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="col-md-3">
					<label className="form-label">Price (₹)</label>
					<input
						type="number"
						name="price"
						className="form-control"
						value={form.price}
						onChange={handleChange}
						required
					/>
				</div>
				<div className="col-12">
					<label className="form-label">Features</label>
					<textarea
						name="features"
						className="form-control"
						rows="3"
						value={form.features}
						onChange={handleChange}
					/>
				</div>
				<div className="col-12">
					<label className="form-label">Description</label>
					<textarea
						name="description"
						className="form-control"
						rows="3"
						value={form.description}
						onChange={handleChange}
					/>
				</div>

				<div className="col-12 text-end">
					<button type="submit" className="btn btn-primary">
						Save Plan
					</button>
				</div>
			</div>
		</form>
	);
};

export default PlanForm;
