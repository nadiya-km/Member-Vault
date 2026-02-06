import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../services/api';

const MemberDetails = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const [member, setMember] = useState(null);
	const [membership, setMembership] = useState(null);
	const [loadingMembership, setLoadingMembership] = useState(true);
	const [profileLink, setProfileLink] = useState('');

	useEffect(() => {
		const fetchMember = async () => {
			const res = await api.get(`/members/${id}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			});
			setMember(res.data.data.member);
			setProfileLink(res.data.data.profileLink);
		};

		const fetchMembership = async () => {
			try {
				const res = await api.get(`/members/${id}/membership`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				});
				setMembership(res.data.data);
			} catch {
				setMembership(null);
			} finally {
				setLoadingMembership(false);
			}
		};

		fetchMember();
		fetchMembership();
	}, [id]);

	if (!member) return <p>Loading...</p>;

	return (
		<>
			<div className="p-4">
				<h2 className="mb-3">Member Details</h2>

				{/* MEMBER INFO */}
				<table className="table table-bordered">
					<tbody>
						<tr>
							<th>Name</th>
							<td>{member.name}</td>
						</tr>
						<tr>
							<th>Email</th>
							<td>{member.email}</td>
						</tr>
						<tr>
							<th>Phone</th>
							<td>{member.phone}</td>
						</tr>
						<tr>
							<th>WhatsApp</th>
							<td>{member.whatsappNumber}</td>
						</tr>
						<tr>
							<th>Age</th>
							<td>{member.age}</td>
						</tr>
					</tbody>
				</table>

				{/* MEMBERSHIP SECTION */}
				<div className="card mt-4">
					<div className="card-header bg-success text-white">
						<h5 className="mb-0">Membership</h5>
					</div>

					<div className="card-body">
						{loadingMembership ? (
							<p>Loading membership...</p>
						) : !membership ? (
							<>
								<p className="text-muted mb-3">No active membership</p>
								<button
									className="btn btn-primary"
									onClick={() => navigate(`/admin/members/${id}/add-membership`)}
								>
									Add Membership
								</button>
							</>
						) : (
							<table className="table table-bordered">
								<tbody>
									<tr>
										<th>Plan</th>
										<td>{membership.planId.name}</td>
									</tr>
									<tr>
										<th>Price</th>
										<td>₹{membership.planId.price}</td>
									</tr>
									<tr>
										<th>Duration</th>
										<td>{membership.planId.durationInMonths} month(s)</td>
									</tr>
									<tr>
										<th>Start Date</th>
										<td>{new Date(membership.startDate).toDateString()}</td>
									</tr>
									<tr>
										<th>End Date</th>
										<td>{new Date(membership.endDate).toDateString()}</td>
									</tr>
									<tr>
										<th>Status</th>
										<td>
											{membership.status === 'active' && (
												<span className="badge bg-success">Active</span>
											)}

											{membership.status === 'paused' && (
												<span className="badge bg-secondary">Paused</span>
											)}

											{membership.status === 'pending_payment' && (
												<span className="badge bg-warning text-dark">Pending Payment</span>
											)}

											{membership.status === 'cancelled' && (
												<span className="badge bg-danger">Cancelled</span>
											)}
										</td>
									</tr>

									{membership.personalTrainer && (
										<tr>
											<th>Trainer</th>
											<td>{membership.personalTrainer.name}</td>
										</tr>
									)}
								</tbody>
							</table>
						)}
					</div>
				</div>
				{/* PROFILE LINK – always visible */}
				<div className="card mt-3">
					<div className="card-header">
						<strong>Member Profile Link</strong>
					</div>
					<div className="card-body">
						<input type="text" className="form-control mb-2" value={profileLink || ''} readOnly />
						<button
							className="btn btn-outline-primary"
							disabled={!profileLink}
							onClick={() => navigator.clipboard.writeText(profileLink)}
						>
							Copy Link
						</button>
					</div>
					<button
						className="btn btn-outline-danger ms-2"
						onClick={async () => {
							if (!window.confirm('This will invalidate the old link. Continue?')) return;

							const res = await api.post(`/members/${id}/regenerate-link`);
							setProfileLink(res.data.profileLink);
							alert('New profile link generated');
						}}
					>
						Regenerate Link
					</button>
				</div>

				{/* ACTION BUTTONS */}
				<div className="row g-2 mt-4">
					<div className="col-md-4 col-12">
						<button
							className="btn btn-secondary w-100"
							onClick={() =>
								membership
									? navigate(`/admin/members/${id}/edit-membership`)
									: navigate(`/admin/members/${id}/add-membership`)
							}
						>
							{membership ? 'Edit Membership' : 'Add Membership'}
						</button>
					</div>

					<div className="col-md-4 col-12">
						<button
							className="btn btn-primary w-100"
							onClick={() => navigate(`/admin/members/${id}/update-trainer`)}
						>
							Update Trainer
						</button>
					</div>

					<div className="col-md-4 col-12">
						<button
							className="btn btn-warning w-100"
							onClick={() => navigate(`/admin/members/${id}/edit`)}
						>
							Edit Member
						</button>
					</div>
				</div>
			</div>
		</>
	);
};
export default MemberDetails;
