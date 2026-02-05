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
		<div className="container mt-4">
			<div className="d-flex justify-content-between align-items-center mb-3">
				<h4>Membership Plans</h4>
				<button className="btn btn-dark" onClick={() => setShowForm(!showForm)}>
					{showForm ? 'Back to Plans' : '+ Add Plan'}
				</button>
			</div>

			<div className="card p-3">
				{showForm ? (
					<PlanForm
						onSuccess={() => {
							setShowForm(false);
							fetchPlans();
						}}
					/>
				) : loading ? (
					<p>Loading...</p>
				) : (
					<PlanTable plans={plans} onRefresh={fetchPlans} />
				)}
			</div>
		</div>
	);
};

export default MembershipPlans;
