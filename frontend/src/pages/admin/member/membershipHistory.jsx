import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../services/api';

const MembershipHistory = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const [history, setHistory] = useState([]);
	const [filter, setFilter] = useState('all');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchHistory = async () => {
			try {
				const res = await api.get(`/members/${id}/membership/history`);
				setHistory(res.data.data || []);
			} catch (err) {
				console.error('Failed to fetch membership history', err);
			} finally {
				setLoading(false);
			}
		};

		fetchHistory();
	}, [id]);

	const filteredHistory = filter === 'all' ? history : history.filter((m) => m.status === filter);

	const statusBadge = (status) => {
		switch (status) {
			case 'active':
				return 'bg-success';
			case 'expired':
				return 'bg-secondary';
			case 'cancelled':
				return 'bg-danger';
			case 'pending_payment':
				return 'bg-warning text-dark';
			case 'scheduled':
				return 'bg-info';
			default:
				return 'bg-dark';
		}
	};

	if (loading) return <p className="p-4">Loading membership history...</p>;

	return (
		<div className="p-4">
			<div className="d-flex justify-content-between align-items-center mb-3">
				<h3>Membership History</h3>
				<button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
					← Back
				</button>
			</div>

			{/* FILTERS */}
			<div className="mb-3 d-flex gap-2 flex-wrap">
				{['all', 'active', 'expired', 'cancelled', 'pending_payment', 'scheduled'].map((s) => (
					<button
						key={s}
						className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-outline-primary'}`}
						onClick={() => setFilter(s)}
					>
						{s.replace('_', ' ').toUpperCase()}
					</button>
				))}
			</div>

			{/* TABLE */}
			<div className="card">
				<div className="card-body p-0">
					{filteredHistory.length === 0 ? (
						<p className="text-muted p-3 mb-0">No memberships found</p>
					) : (
						<table className="table table-hover mb-0">
							<thead className="table-light">
								<tr>
									<th>Plan</th>
									<th>Duration</th>
									<th>Start</th>
									<th>End</th>
									<th>Status</th>
									<th>Payment</th>
								</tr>
							</thead>
							<tbody>
								{filteredHistory.map((m) => (
									<tr key={m._id}>
										<td>{m.planId?.name}</td>
										<td>{m.planId?.durationInMonths} months</td>
										<td>{new Date(m.startDate).toDateString()}</td>
										<td>{new Date(m.endDate).toDateString()}</td>
										<td>
											<span className={`badge ${statusBadge(m.status)}`}>
												{m.status.replace('_', ' ')}
											</span>
										</td>
										<td>
											<span
												className={`badge ${
													m.paymentStatus === 'paid' ? 'bg-success' : 'bg-warning text-dark'
												}`}
											>
												{m.paymentStatus || 'unpaid'}
											</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
				</div>
			</div>
		</div>
	);
};

export default MembershipHistory;
