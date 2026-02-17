import { useEffect, useState } from 'react';
import { getPlans } from '../../services/planService';
import PlanForm from '../../components/plans/PlanForm';
import PlanTable from '../../components/plans/PlanTable';


const MembershipPlans = () => {
	const [plans, setPlans] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);

	const fetchPlans = async () => {
		try {
			const res = await getPlans();
			setPlans(res.data.data);
		} catch (err) {
			alert(err.response?.data?.message || 'Error fetching plans');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPlans();
	}, []);

	return (
		<div className="container-fluid p-0">
			<div className="d-flex justify-content-between align-items-center mb-4">
				<div>
					<h2 className="oxford-title fw-bold underline">Membership Plans</h2>
					<p className="text-muted mb-0">Manage your facility access tiers</p>
				</div>
				<button
					className="btn-oxford-primary px-4"
					onClick={() => setShowForm(!showForm)}
				>
					{showForm ? (
						<>
							<i className="bi bi-arrow-left me-2"></i>
							Back to Plans
						</>
					) : (
						<>
							<i className="bi bi-plus-lg me-2"></i>
							Create New Plan
						</>
					)}
				</button>
			</div>

			<div className="oxford-card">
				<div className="oxford-card-body">
					{showForm ? (
						<PlanForm
							onSuccess={() => {
								setShowForm(false);
								fetchPlans();
							}}
						/>
					) : loading ? (
						<div className="text-center py-5">
							<div className="spinner-border text-primary" />
							<p className="mt-2 mb-0">Fetching plans...</p>
						</div>
					) : plans.length === 0 ? (
						<div className="text-center py-5">
							<i className="bi bi-folder2-open display-4 text-muted"></i>
							<p className="text-muted mt-2">No plans defined yet</p>
						</div>
					) : (
						<div className="p-1">
							<PlanTable plans={plans} onRefresh={fetchPlans} />
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default MembershipPlans;
