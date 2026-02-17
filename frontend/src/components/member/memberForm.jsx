import { useEffect, useState } from 'react';
import api from '../../services/api';

const MemberForm = ({ closeForm, refreshMembers, mode = 'add', initialData = null }) => {
	const [trainers, setTrainers] = useState([]);

	const [formData, setFormData] = useState({
		name: initialData?.name || '',
		email: initialData?.email || '',
		phone: initialData?.phone || '',
		whatsappNumber: initialData?.whatsappNumber || '',
		age: initialData?.age || '',
		personalTrainer: initialData?.personalTrainer?._id || initialData?.personalTrainer || '',
	});

	useEffect(() => {
		fetchTrainers();
	}, []);

	const fetchTrainers = async () => {
		try {
			const res = await api.get('/trainers', {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			});
			setTrainers(res.data.data);
		} catch {
			console.error('Failed to load trainers');
		}
	};

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const payload = {
				...formData,
				personalTrainer: formData.personalTrainer || null,
			};

			if (mode === 'edit' && initialData?._id) {
				await api.put(`/members/${initialData._id}`, payload, {
					headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
				});
			} else {
				await api.post('/members', payload, {
					headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
				});
			}

			refreshMembers();
			closeForm();
		} catch (err) {
			alert(err.response?.data?.message || `Error ${mode === 'edit' ? 'updating' : 'creating'} member`);
		}
	};

	return (
		<div className={mode === 'edit' ? "" : "fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"}>
			<form onSubmit={handleSubmit} className={`oxford-card p-4 rounded shadow-2xl ${mode === 'edit' ? 'w-full' : 'w-96'}`}>
				<h3 className="oxford-title mb-4 with-underline">
					{mode === 'edit' ? 'Refine Member Details' : 'New Member Entry'}
				</h3>

				<div className="mb-3">
					<label className="oxford-label">Full Name</label>
					<input
						type="text"
						name="name"
						className="form-control"
						value={formData.name}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="row mb-3">
					<div className="col-md-6">
						<label className="oxford-label">Email</label>
						<input
							type="email"
							name="email"
							className="form-control"
							value={formData.email}
							onChange={handleChange}
							required
						/>
					</div>
					<div className="col-md-6">
						<label className="oxford-label">Age</label>
						<input
							type="number"
							name="age"
							className="form-control"
							value={formData.age}
							onChange={handleChange}
							required
						/>
					</div>
				</div>

				<div className="row mb-3">
					<div className="col-md-6">
						<label className="oxford-label">Phone</label>
						<input
							type="text"
							name="phone"
							className="form-control"
							value={formData.phone}
							onChange={handleChange}
							required
						/>
					</div>
					<div className="col-md-6">
						<label className="oxford-label">WhatsApp</label>
						<input
							type="text"
							name="whatsappNumber"
							className="form-control"
							value={formData.whatsappNumber}
							onChange={handleChange}
						/>
					</div>
				</div>

				<div className="mb-4">
					<label className="oxford-label">Personal Trainer (Optional)</label>
					<select
						name="personalTrainer"
						className="form-select"
						onChange={handleChange}
					>
						<option value="">None</option>
						{trainers.map((t) => (
							<option key={t._id} value={t._id}>
								{t.name}
							</option>
						))}
					</select>
				</div>

				<div className="d-flex justify-content-between gap-3 mt-4">
					<button type="button" className="btn-oxford-secondary w-full" onClick={closeForm}>
						Cancel
					</button>
					<button type="submit" className="btn-oxford-primary w-full">
						Save Member
					</button>
				</div>
			</form>
		</div>
	);
};

export default MemberForm;
