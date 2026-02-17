import { useState, useEffect, useRef } from 'react';
import $ from 'jquery';

import 'datatables.net';
import 'datatables.net-responsive';

import { deletePlan, updatePlan } from '../../services/planService';

const PlanTable = ({ plans = [], onRefresh }) => {
	const tableRef = useRef(null);

	const [selectedPlan, setSelectedPlan] = useState(null);
	const [editMode, setEditMode] = useState(false);
	const [form, setForm] = useState({
		name: '',
		durationInMonths: '',
		price: '',
		features: '',
		description: '',
	});

	/* ================= DATATABLE INIT ================= */
	useEffect(() => {
		if (!plans.length) return;

		const table = $(tableRef.current).DataTable({
			destroy: true,
			responsive: false,
			scrollX: true,     
			autoWidth: false,
			pageLength: 10,
			columnDefs: [{ orderable: false, targets: 5 }],
		});

		return () => table.destroy();
	}, [plans]);

	
	const handleView = (plan) => {
		setSelectedPlan(plan);
		setEditMode(false);
		setForm({
			name: plan.name,
			durationInMonths: plan.durationInMonths,
			price: plan.price,
			features: plan.features || '',
			description: plan.description || '',
		});
	};

	const handleChange = (e) =>
		setForm({ ...form, [e.target.name]: e.target.value });

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

		await updatePlan(selectedPlan._id, {
			...form,
			durationInMonths: Number(form.durationInMonths),
			price: Number(form.price),
		});

		setEditMode(false);
		onRefresh();
	};

	
	return (
		<>
			<div className="table-responsive">
				<table
					ref={tableRef}
					className="display nowrap table table-bordered table-hover align-middle w-100"
				>
					<thead className="table-light">
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
								<td colSpan="6" className="text-center">
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

		
			<div className="modal fade" id="planModal" tabIndex="-1">
				<div className="modal-dialog modal-dialog-centered modal-md">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">
								{editMode ? 'Edit Plan' : 'Plan Details'}
							</h5>
							<button type="button" className="btn-close" data-bs-dismiss="modal" />
						</div>

						<div className="modal-body">
							{!editMode ? (
								selectedPlan && (
									<>
										<p><strong>Name:</strong> {selectedPlan.name}</p>
										<p><strong>Duration:</strong> {selectedPlan.durationInMonths} months</p>
										<p><strong>Price:</strong> ₹{selectedPlan.price}</p>
										<p><strong>Features:</strong> {selectedPlan.features || '-'}</p>
										<p><strong>Description:</strong> {selectedPlan.description || '-'}</p>
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
										className="form-control mb-2"
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
									<button className="btn btn-success w-100 mt-3">
										Save Changes
									</button>
								</form>
							)}
						</div>

						<div className="modal-footer">
							{!editMode ? (
								<>
									<button
										className="btn btn-outline-primary btn-sm"
										onClick={() => setEditMode(true)}
									>
										Edit
									</button>
									<button
										className="btn btn-outline-danger btn-sm"
										onClick={handleDelete}
										data-bs-dismiss="modal"
									>
										Delete
									</button>
								</>
							) : (
								<button
									className="btn btn-secondary btn-sm"
									onClick={() => setEditMode(false)}
								>
									Cancel
								</button>
							)}
							<button className="btn btn-secondary btn-sm" data-bs-dismiss="modal">
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