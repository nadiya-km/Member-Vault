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
		<div className="p-4">
			<div className="d-flex justify-content-between align-items-center mb-3">
				<h2>Personal Trainers</h2>
				<button className="btn btn-dark" onClick={() => setShowForm(!showForm)}>
					{showForm ? 'Close' : '+ Add Trainer'}
				</button>
			</div>

			{showForm && <TrainerForm onSuccess={fetchTrainers} />}

			{loading ? <p>Loading...</p> : <TrainerTable trainers={trainers} onRefresh={fetchTrainers} />}
		</div>
	);
};

export default Trainers;
