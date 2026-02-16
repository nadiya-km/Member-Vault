import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../services/api';

const EditMember = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const [form, setForm] = useState({
		name: '',
		email: '',
		phone: '',
		whatsappNumber: '',
		age: '',
		status: 'active',
	});

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchMember = async () => {
			const res = await api.get(`/members/${id}`);
			const m = res.data.data.member;

			setForm({
				name: m.name,
				email: m.email,
				phone: m.phone,
				whatsappNumber: m.whatsappNumber,
				age: m.age || '',
				status: m.status,
			});

			setLoading(false);
		};

		fetchMember();
	}, [id]);

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			await api.put(`/members/${id}`, form);
			alert('Member updated successfully');
			navigate(`/admin/members/${id}`);
		} catch {
			alert('Failed to update member');
		}
	};

	if (loading) return <p className="p-4">Loading...</p>;

	return (
		<div className="p-4">
			<h3 className="mb-4">Edit Member</h3>

			<form onSubmit={handleSubmit} className="card p-4 shadow-sm">
				<div className="mb-3">
					<label>Name</label>
					<input
						className="form-control"
						name="name"
						value={form.name}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="mb-3">
					<label>Email</label>
					<input
						type="email"
						className="form-control"
						name="email"
						value={form.email}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="mb-3">
					<label>Phone</label>
					<input
						className="form-control"
						name="phone"
						value={form.phone}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="mb-3">
					<label>WhatsApp</label>
					<input
						className="form-control"
						name="whatsappNumber"
						value={form.whatsappNumber}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="mb-3">
					<label>Age</label>
					<input
						type="number"
						className="form-control"
						name="age"
						value={form.age}
						onChange={handleChange}
					/>
				</div>

				<div className="mb-3">
					<label>Status</label>
					<select
						className="form-select"
						name="status"
						value={form.status}
						onChange={handleChange}
					>
						<option value="active">Active</option>
						<option value="inactive">Inactive</option>
					</select>
				</div>

				<div className="d-flex gap-2">
					<button className="btn btn-primary">Save Changes</button>
					<button
						type="button"
						className="btn btn-secondary"
						onClick={() => navigate(-1)}
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
};

export default EditMember;