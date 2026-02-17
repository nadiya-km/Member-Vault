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
		<div className="container-fluid p-0">
			{/* HEADER */}
			<div className="d-flex justify-content-between align-items-center mb-4">
				<div>
					<h2 className="oxford-title fw-bold underline">Member Directory</h2>
					<p className="text-muted mb-0">
						Total Active: <span className="fw-bold text-dark">{members.length}</span>
					</p>
				</div>

				<button
					className={showForm ? "btn-oxford-secondary" : "btn-oxford-primary"}
					onClick={() => setShowForm(!showForm)}
				>
					{showForm ? (
						<>
							<i className="bi bi-x-lg me-2"></i>
							Close Entry
						</>
					) : (
						<>
							<i className="bi bi-person-plus-fill me-2"></i>
							Add New Member
						</>
					)}
				</button>
			</div>

			{/* ADD MEMBER FORM */}
			{showForm && (
				<div className="oxford-card mb-4 border-primary-subtle shadow-lg">
					<div className="oxford-card-body">
						<MemberForm closeForm={() => setShowForm(false)} refreshMembers={fetchMembers} />
					</div>
				</div>
			)}

			{/* SEARCH BAR & DIRECTORY HEADER */}
			<div className="oxford-card mb-4 border-0 shadow-sm">
				<div className="oxford-card-body p-3 d-flex flex-column flex-md-row justify-content-between align-items-md-center">
					<div className="mb-3 mb-md-0">
						<h5 className="mb-0 fw-bold text-midnight">
							<i className="bi bi-person-lines-fill me-2"></i>Member Records
						</h5>
					</div>
					<div className="search-wrapper" style={{ minWidth: '300px' }}>
						<div className="input-group bg-light rounded-pill px-3 py-1">
							<span className="input-group-text bg-transparent border-0 pe-2">
								<i className="bi bi-search text-muted"></i>
							</span>
							<input
								type="text"
								className="form-control border-0 bg-transparent shadow-none"
								placeholder="Search members..."
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								style={{ fontSize: '0.9rem' }}
							/>
						</div>
					</div>
				</div>
			</div>

			{/* MEMBERS TABLE */}
			<div className="oxford-card">
				<div className="oxford-card-body p-0">
					{loading ? (
						<div className="text-center py-5">
							<div className="spinner-border text-primary" />
							<p className="mt-2 mb-0">Loading members database...</p>
						</div>
					) : filteredMembers.length === 0 ? (
						<div className="text-center py-5">
							<i className="bi bi-inbox text-muted display-4"></i>
							<p className="text-muted mt-2">No matching records found</p>
						</div>
					) : (
						<div className="p-1">
							<MemberTable members={filteredMembers} />
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Member;
