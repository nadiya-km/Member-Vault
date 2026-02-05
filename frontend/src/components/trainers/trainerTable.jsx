import { useState } from 'react';
import { deleteTrainer, updateTrainer } from '../../services/trainerService';

const TrainerTable = ({ trainers, onRefresh }) => {
	const [selectedTrainer, setSelectedTrainer] = useState(null);
	const [editMode, setEditMode] = useState(false);
	const [form, setForm] = useState({
		name: '',
		specialization: '',
		experience: '',
		pricePerMonth: '',
	});
	const handleView = (trainer) => {
		setSelectedTrainer(trainer);
		setEditMode(false);
		setForm({
			name: trainer.name,
			specialization: trainer.specialization,
			experience: trainer.experience,
			pricePerMonth: trainer.pricePerMonth,
		});
	};

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleUpdate = async (e) => {
		e.preventDefault();

		try {
			await updateTrainer(selectedTrainer._id, {
				...form,
				experience: Number(form.experience),
				pricePerMonth: Number(form.pricePerMonth),
			});

			setEditMode(false);
			onRefresh();
		} catch (err) {
			alert(err?.response?.data?.message || 'Update failed');
		}
	};

	const handleDelete = async () => {
		if (!window.confirm('Disable this trainer?')) return;
		await deleteTrainer(selectedTrainer._id);
		setSelectedTrainer(null);
		onRefresh();
	};

	return (
		<>
			<div className="table-responsive">
				<table className="table table-bordered table-hover align-middle">
					<thead className="table-dark">
						<tr>
							<th>Name</th>
							<th>Specialization</th>
							<th>Experience</th>
							<th>Price / Month</th>
							<th className="text-center">Actions</th>
						</tr>
					</thead>

					<tbody>
						{trainers.length === 0 ? (
							<tr>
								<td colSpan="5" className="text-center">
									No trainers found
								</td>
							</tr>
						) : (
							trainers.map((trainer) => (
								<tr key={trainer._id}>
									<td className="fw-semibold">{trainer.name}</td>
									<td>{trainer.specialization}</td>
									<td>{trainer.experience} yrs</td>
									<td>₹{trainer.pricePerMonth}</td>
									<td className="text-center">
										<button
											className="btn btn-sm btn-outline-primary"
											data-bs-toggle="modal"
											data-bs-target="#trainerModal"
											onClick={() => handleView(trainer)}
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
			<div className="modal fade" id="trainerModal" tabIndex="-1">
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">{editMode ? 'Edit Trainer' : 'Trainer Details'}</h5>
							<button type="button" className="btn-close" data-bs-dismiss="modal"></button>
						</div>

						<div className="modal-body">
							{!editMode ? (
								selectedTrainer && (
									<>
										<p>
											<strong>Name:</strong> {selectedTrainer.name}
										</p>
										<p>
											<strong>Specialization:</strong> {selectedTrainer.specialization}
										</p>
										<p>
											<strong>Experience:</strong> {selectedTrainer.experience} years
										</p>
										<p>
											<strong>Price:</strong> ₹{selectedTrainer.pricePerMonth}/month
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
									/>
									<input
										className="form-control mb-2"
										name="specialization"
										value={form.specialization}
										onChange={handleChange}
									/>
									<input
										className="form-control mb-2"
										type="number"
										name="experience"
										value={form.experience}
										onChange={handleChange}
									/>
									<input
										className="form-control mb-2"
										type="number"
										name="pricePerMonth"
										value={form.pricePerMonth}
										onChange={handleChange}
									/>

									<button className="btn btn-success mt-3">Save Changes</button>
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

export default TrainerTable;
