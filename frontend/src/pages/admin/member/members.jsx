import { useEffect, useState } from 'react';
import api from '../../../services/api';


import MemberForm from '../../../components/member/memberForm';
import MemberTable from '../../../components/member/memberTable';

const Member = () => {
	const [members, setMembers] = useState([]);
	const [filteredMembers, setFilteredMembers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showForm, setShowForm] = useState(false);
	const [search, setSearch] = useState('');

	const fetchMembers = async () => {
		try {
			const res = await api.get('/members', {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			});
			setMembers(res.data.data);
			setFilteredMembers(res.data.data);
		} catch {
			alert('Failed to load members');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchMembers();
	}, []);

	useEffect(() => {
		const filtered = members.filter((m) =>
			`${m.name} ${m.phone}`.toLowerCase().includes(search.toLowerCase())
		);
		setFilteredMembers(filtered);
	}, [search, members]);

	return (
		<>
			<div className="container-fluid p-4">
				{/* HEADER */}
				<div className="d-flex justify-content-between align-items-center mb-4">
					<div>
						<h2 className="fw-bold mb-1">Members</h2>
						<p className="text-muted mb-0">
							Total Members: <strong>{members.length}</strong>
						</p>
					</div>

					<button
						className={`btn ${showForm ? 'btn-outline-secondary' : 'btn-dark'}`}
						onClick={() => setShowForm(!showForm)}
					>
						{showForm ? 'Close Form' : '+ Add Member'}
					</button>
				</div>

				{/* ADD MEMBER FORM */}
				{showForm && (
					<div className="card shadow-sm mb-4">
						<div className="card-body">
							<MemberForm closeForm={() => setShowForm(false)} refreshMembers={fetchMembers} />
						</div>
					</div>
				)}

				{/* SEARCH BAR */}
				<div className="card shadow-sm mb-3">
					<div className="card-body">
						<input
							type="text"
							className="form-control"
							placeholder="Search by name or phone..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>
				</div>

				{/* MEMBERS TABLE */}
				<div className="card shadow-sm">
					<div className="card-body">
						{loading ? (
							<div className="text-center py-5">
								<div className="spinner-border text-dark" />
								<p className="mt-2 mb-0">Loading members...</p>
							</div>
						) : filteredMembers.length === 0 ? (
							<p className="text-center text-muted mb-0">No members found</p>
						) : (
							<MemberTable members={filteredMembers} />
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default Member;
