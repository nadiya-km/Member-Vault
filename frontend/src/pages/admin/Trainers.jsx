import { useEffect, useState } from 'react';
import { getTrainers } from '../../services/trainerService';
import TrainerForm from '../../components/trainers/TrainerForm';
import TrainerTable from '../../components/trainers/TrainerTable';


const Trainers = () => {
	const [trainers, setTrainers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);

	const fetchTrainers = async () => {
		try {
			const res = await getTrainers();
			setTrainers(res.data.data);
		} catch {
			alert('Failed to load trainers');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchTrainers();
	}, []);

	return (
		<div className="container-fluid p-0">
			<div className="d-flex justify-content-between align-items-center mb-4">
				<div>
					<h2 className="oxford-title fw-bold underline">Personal Trainers</h2>
					<p className="text-muted mb-0">Manage your professional coaching staff</p>
				</div>
				<button
					className="btn-oxford-primary px-4"
					onClick={() => setShowForm(!showForm)}
				>
					{showForm ? (
						<>
							<i className="bi bi-x-lg me-2"></i>
							Close Form
						</>
					) : (
						<>
							<i className="bi bi-plus-lg me-2"></i>
							Assign New Trainer
						</>
					)}
				</button>
			</div>

			{showForm && (
				<div className="oxford-card mb-4 border-0 shadow-lg">
					<div className="oxford-card-body">
						<TrainerForm onSuccess={() => {
							setShowForm(false);
							fetchTrainers();
						}} />
					</div>
				</div>
			)}

			<div className="oxford-card">
				<div className="oxford-card-body">
					{loading ? (
						<div className="text-center py-5">
							<div className="spinner-border text-primary" />
						</div>
					) : (
						<div className="p-1">
							<TrainerTable trainers={trainers} onRefresh={fetchTrainers} />
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Trainers;
