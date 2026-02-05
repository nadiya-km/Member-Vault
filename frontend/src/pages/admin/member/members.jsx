import { useEffect, useState } from 'react';
import api from '../../../services/api';

import MemberForm from '../../../components/member/memberForm';
import MemberTable from '../../../components/member/memberTable';

const Member = () => {
	const [members, setMembers] = useState([]);
	const [showForm, setShowForm] = useState(false);

	const fetchMembers = async () => {
		try {
			const res = await api.get('/members', {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			});

			setMembers(res.data.data);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		fetchMembers();
	}, []);

	return (
		<div className="p-4">
			<h2 className="text-xl font-bold mb-4">Members</h2>

			<button
				className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
				onClick={() => setShowForm(true)}
			>
				Add Member
			</button>

			<MemberTable members={members} />

			{showForm && (
				<MemberForm closeForm={() => setShowForm(false)} refreshMembers={fetchMembers} />
			)}
		</div>
	);
};

export default Member;
