import { useEffect, useState } from 'react';
import api from '../../services/api';

const MemberForm = ({ closeForm, refreshMembers }) => {
	const [trainers, setTrainers] = useState([]);

	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		whatsappNumber: '',
		age: '',
		personalTrainer: '', // 👈 optional
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
			await api.post(
				'/members',
				{
					...formData,
					personalTrainer: formData.personalTrainer || null, // ✅ important
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				}
			);

			refreshMembers();
			closeForm();
		} catch (err) {
			alert(err.response?.data?.message || 'Error creating member');
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
			<form onSubmit={handleSubmit} className="bg-white p-6 rounded w-96">
				<h3 className="text-lg font-semibold mb-4">Add Member</h3>

				<input
					type="text"
					name="name"
					placeholder="Name"
					className="border p-2 w-full mb-2"
					onChange={handleChange}
					required
				/>

				<input
					type="email"
					name="email"
					placeholder="Email"
					className="border p-2 w-full mb-2"
					onChange={handleChange}
					required
				/>

				<input
					type="text"
					name="phone"
					placeholder="Phone"
					className="border p-2 w-full mb-2"
					onChange={handleChange}
					required
				/>

				<input
					type="text"
					name="whatsappNumber"
					placeholder="WhatsApp Number"
					className="border p-2 w-full mb-2"
					onChange={handleChange}
					required
				/>

				<input
					type="number"
					name="age"
					placeholder="Age"
					className="border p-2 w-full mb-2"
					onChange={handleChange}
				/>

				{/* ✅ Personal Trainer (Optional) */}
				<select name="personalTrainer" className="border p-2 w-full mb-4" onChange={handleChange}>
					<option value="">No Personal Trainer</option>
					{trainers.map((t) => (
						<option key={t._id} value={t._id}>
							{t.name}
						</option>
					))}
				</select>

				<div className="flex justify-between">
					<button type="button" className="bg-gray-400 px-4 py-2 rounded" onClick={closeForm}>
						Cancel
					</button>

					<button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
						Save
					</button>
				</div>
			</form>
		</div>
	);
};

export default MemberForm;
