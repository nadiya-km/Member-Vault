import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import AdminLayout from '../../../components/layout/AdminLayout';

const EditMembership = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const [plans, setPlans] = useState([]);
	const [trainers, setTrainers] = useState([]);
	const [membership, setMembership] = useState(null);

	const [formData, setFormData] = useState({
		planId: '',
		endDate: '',
		personalTrainer: '',
		status: '',
	});

	useEffect(() => {
		loadData();
	}, []);

	const loadData = async () => {
		const membershipRes = await api.get(`/members/${id}/membership`);
		const plansRes = await api.get('/membership-plans');
		const trainersRes = await api.get('/trainers');

		const m = membershipRes.data.data;
		setMembership(m);

		setFormData({
			planId: m.planId._id,
			endDate: m.endDate.split('T')[0],
			personalTrainer: m.personalTrainer?._id || '',
			status: m.status,
		});

		setPlans(plansRes.data.data);
		setTrainers(trainersRes.data.data);
	};

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		await api.put(`/members/${id}/membership`, formData);
		alert('Membership updated');
		navigate(`/admin/members/${id}`);
	};

	if (!membership) return null;

	return (
		<AdminLayout>
			<div className="container mt-4">
				<div className="card">
					<div className="card-header bg-warning">
						<h5>Edit Membership</h5>
					</div>

					<div className="card-body">
						<form onSubmit={handleSubmit}>
							{/* PLAN */}
							<div className="mb-3">
								<label>Plan</label>
								<select
									name="planId"
									className="form-select"
									value={formData.planId}
									onChange={handleChange}
								>
									{plans.map((p) => (
										<option key={p._id} value={p._id}>
											{p.name}
										</option>
									))}
								</select>
							</div>

							{/* END DATE */}
							<div className="mb-3">
								<label>End Date</label>
								<input
									type="date"
									name="endDate"
									className="form-control"
									value={formData.endDate}
									onChange={handleChange}
								/>
							</div>

							{/* TRAINER */}
							<div className="mb-3">
								<label>Trainer</label>
								<select
									name="personalTrainer"
									className="form-select"
									value={formData.personalTrainer}
									onChange={handleChange}
								>
									<option value="">No Trainer</option>
									{trainers.map((t) => (
										<option key={t._id} value={t._id}>
											{t.name}
										</option>
									))}
								</select>
							</div>

							{/* STATUS */}
							<div className="mb-3">
								<select
									name="status"
									className="form-select"
									value={formData.status}
									onChange={handleChange}
								>
									<option value="active" disabled={membership.status === 'pending_payment'}>
										Active
									</option>

									<option value="paused" disabled={membership.status !== 'active'}>
										Paused
									</option>

									<option value="cancelled">Cancelled</option>

									{membership.status === 'pending_payment' && (
										<option value="pending_payment">Payment Pending</option>
									)}
								</select>
							</div>

							<button className="btn btn-success">Save Changes</button>
						</form>
					</div>
				</div>
			</div>
		</AdminLayout>
	);
};

export default EditMembership;
