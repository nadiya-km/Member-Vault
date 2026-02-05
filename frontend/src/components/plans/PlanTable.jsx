import { useState } from 'react';
import { deletePlan, updatePlan } from '../../services/planService';
import AdminLayout from '../../components/layout/AdminLayout';

const PlanTable = ({ plans, onRefresh }) => {
	const [selectedPlan, setSelectedPlan] = useState(null);
	const [editMode, setEditMode] = useState(false);
	const [form, setForm] = useState({
		name: '',
		durationInMonths: '',
		price: '',
		description: '',
	});

	const handleView = (plan) => {
		setSelectedPlan(plan);
		setEditMode(false);
		setForm({
			name: plan.name,
			durationInMonths: plan.durationInMonths,
			price: plan.price,
            features: plan.features  ||'',
			description: plan.description || '',
		});
	};

	const handleDelete = async () => {
		if (!window.confirm('Disable this plan?')) return;
		await deletePlan(selectedPlan._id);
		setSelectedPlan(null);
		onRefresh();
	};
const handleUpdate = async (e) => {
	e.preventDefault();

	if (!form.name || !form.durationInMonths || !form.price) {
		alert('Name, duration and price are required');
		return;
	}

	try {
		const res = await updatePlan(selectedPlan._id, {
			...form,
			durationInMonths: Number(form.durationInMonths),
			price: Number(form.price),
		});

		// 🔥 IMPORTANT: update modal data immediately
		setSelectedPlan((prev) => ({
			...prev,
			...form,
		}));

		setEditMode(false);
		onRefresh();
	} catch (err) {
		alert(err?.response?.data?.message || 'Update failed');
	}
};


	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	return (
		<>
			<div className="table-responsive">
				<table className="table table-bordered table-hover align-middle">
					<thead className="table-dark">
						<tr>
							<th>Name</th>
							<th>Duration</th>
							<th>Price</th>
							<th>Features</th>
							<th>Description</th>
							<th className="text-center">Actions</th>
						</tr>
					</thead>

					<tbody>
						{plans.length === 0 ? (
							<tr>
								<td colSpan="5" className="text-center">
									No plans found
								</td>
							</tr>
						) : (
							plans.map((plan) => (
								<tr key={plan._id}>
									<td className="fw-semibold">{plan.name}</td>
									<td>{plan.durationInMonths} Months</td>
									<td>₹{plan.price}</td>
									<td>{plan.features || '-'}</td>
									<td>{plan.description || '-'}</td>
									<td className="text-center">
										<button
											className="btn btn-sm btn-outline-primary"
											data-bs-toggle="modal"
											data-bs-target="#planModal"
											onClick={() => handleView(plan)}
										>
											View
										</button>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{/* ===== MODAL ===== */}
			<div className="modal fade" id="planModal" tabIndex="-1">
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">{editMode ? 'Edit Plan' : 'Plan Details'}</h5>
							<button type="button" className="btn-close" data-bs-dismiss="modal"></button>
						</div>

						<div className="modal-body">
							{!editMode ? (
								selectedPlan && (
									<>
										<p>
											<strong>Name:</strong> {selectedPlan.name}
										</p>
										<p>
											<strong>Duration:</strong> {selectedPlan.durationInMonths} months
										</p>
										<p>
											<strong>Price:</strong> ₹{selectedPlan.price}
										</p>
										<p>
											<strong>Features:</strong> {selectedPlan.description || '-'}
										</p>
										<p>
											<strong>Description:</strong> {selectedPlan.description || '-'}
										</p>
									</>
								)
							) : (
								<form onSubmit={handleUpdate}>
									<input
										className="form-control mb-2"
										name="name"
										value={form.name}
										onChange={handleChange}
										placeholder="Plan Name"
									/>
									<input
										className="form-control mb-2"
										type="number"
										name="durationInMonths"
										value={form.durationInMonths}
										onChange={handleChange}
										placeholder="Duration (months)"
									/>
									<input
										className="form-control mb-2"
										type="number"
										name="price"
										value={form.price}
										onChange={handleChange}
										placeholder="Price"
									/>
									<textarea
										className="form-control"
										name="features"
										value={form.features}
										onChange={handleChange}
										placeholder="Features"
									/>
									<textarea
										className="form-control"
										name="description"
										value={form.description}
										onChange={handleChange}
										placeholder="Description"
									/>
									<button type="submit" className="btn btn-success mt-3">
										Save Changes
									</button>
								</form>
							)}
						</div>

						<div className="modal-footer">
							{!editMode ? (
								<>
									<button className="btn btn-outline-primary" onClick={() => setEditMode(true)}>
										Edit
									</button>
									<button
										className="btn btn-outline-danger"
										onClick={handleDelete}
										data-bs-dismiss="modal"
									>
										Delete
									</button>
								</>
							) : (
								<button className="btn btn-secondary" onClick={() => setEditMode(false)}>
									Cancel
								</button>
							)}
							<button className="btn btn-secondary" data-bs-dismiss="modal">
								Close
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default PlanTable;
