import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import MemberForm from '../../../components/member/memberForm';

const EditMember = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [member, setMember] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchMember = async () => {
			try {
				const res = await api.get(`/members/${id}`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				});
				setMember(res.data.data.member);
			} catch (err) {
				console.error('Failed to fetch member', err);
				alert('Member not found');
				navigate('/admin/members');
			} finally {
				setLoading(false);
			}
		};

		fetchMember();
	}, [id, navigate]);

	if (loading) {
		return (
			<div className="d-flex justify-content-center align-items-center py-5">
				<div className="spinner-border text-primary" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
			</div>
		);
	}

	return (
		<div className="container-fluid p-0">
			<div className="mb-4">
				<h2 className="oxford-title fw-bold underline">Management Console</h2>
				<p className="text-muted">Update profile information for {member?.name}</p>
			</div>

			<div className="row justify-content-center">
				<div className="col-lg-8">
					<MemberForm
						mode="edit"
						initialData={member}
						closeForm={() => navigate(`/admin/members/${id}`)}
						refreshMembers={() => { }} // Not strictly needed here as we navigate away
					/>
				</div>
			</div>
		</div>
	);
};

export default EditMember;