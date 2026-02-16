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
			try {
				const res = await api.get(`/members/${id}`);
				setMember(res.data.data.member);
				setProfileLink(res.data.data.profileLink);
			} catch (err) {
				console.error('Failed to fetch member', err);
			}
		};

		const fetchMembership = async () => {
			try {
				const res = await api.get(`/members/${id}/membership`);
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

	if (!member) return <p className="p-4">Loading member...</p>;

	return (
		<div className="p-4">
			<h2 className="mb-4">Member Details</h2>

			{/* MEMBER INFO */}
			<div className="card mb-4">
				<div className="card-header">
					<h5 className="mb-0">Member Info</h5>
				</div>
				<div className="card-body row g-3">
					<div className="col-md-4">
						<strong>Name:</strong> {member.name}
					</div>
					<div className="col-md-4">
						<strong>Email:</strong> {member.email}
					</div>
					<div className="col-md-4">
						<strong>Phone:</strong> {member.phone}
					</div>
					<div className="col-md-4">
						<strong>WhatsApp:</strong> {member.whatsappNumber}
					</div>
					<div className="col-md-4">
						<strong>Age:</strong> {member.age}
					</div>
				</div>
			</div>

			{/* CURRENT MEMBERSHIP */}
			<div className="card mb-4">
				<div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
					<h5 className="mb-0">Current Membership</h5>
					{membership && (
						<span
							className={`badge ${
								membership.status === 'active'
									? 'bg-light text-success'
									: membership.status === 'pending_payment'
										? 'bg-warning text-dark'
										: 'bg-secondary'
							}`}
						>
							{membership.status.replace('_', ' ').toUpperCase()}
						</span>
					)}
				</div>

				<div className="card-body">
					{loadingMembership ? (
						<p>Loading membership...</p>
					) : !membership ? (
						/* NO MEMBERSHIP AT ALL */
						<div className="text-center">
							<p className="text-muted">No membership found</p>
							<button
								className="btn btn-primary"
								onClick={() => navigate(`/admin/members/${id}/add-membership`)}
							>
								Add Membership
							</button>
						</div>
					) : membership.status === 'cancelled' || membership.status === 'expired' ? (
						/* CANCELLED / EXPIRED */
						<div className="text-center">
							<p className="fw-semibold text-danger">
								Last membership was {membership.status.toUpperCase()}
							</p>

							{membership.status === 'cancelled' && (
								<p className="text-secondary mb-3">
									<strong>Cancelled On:</strong> {new Date(membership.updatedAt).toDateString()}
								</p>
							)}

							<button
								className="btn btn-primary"
								onClick={() => navigate(`/admin/members/${id}/add-membership`)}
							>
								Add New Membership
							</button>
						</div>
					) : (
						/* ACTIVE / PENDING / SCHEDULED */
						<div className="row g-3">
							<div className="col-md-4">
								<strong>Plan:</strong> {membership.planId.name}
							</div>

							<div className="col-md-4">
								<strong>Price:</strong> ₹{membership.planId.price}
							</div>

							<div className="col-md-4">
								<strong>Duration:</strong> {membership.planId.durationInMonths} months
							</div>

							<div className="col-md-4">
								<strong>Start:</strong> {new Date(membership.startDate).toDateString()}
							</div>

							<div className="col-md-4">
								<strong>End:</strong> {new Date(membership.endDate).toDateString()}
							</div>

							<div className="col-md-4">
								<strong>Status:</strong>{' '}
								<span
									className={`badge ${
										membership.status === 'active'
											? 'bg-success'
											: membership.status === 'pending_payment'
												? 'bg-warning text-dark'
												: 'bg-info'
									}`}
								>
									{membership.status.replace('_', ' ').toUpperCase()}
								</span>
							</div>

							{membership.personalTrainer && (
								<div className="col-md-4">
									<strong>Trainer:</strong> {membership.personalTrainer.name}
								</div>
							)}
						</div>
					)}
				</div>
			</div>

			{/* PROFILE LINK */}
			<div className="card mb-4">
				<div className="card-header">
					<strong>Member Profile Link</strong>
				</div>
				<div className="card-body">
					<input className="form-control mb-2" value={profileLink || ''} readOnly />
					<div className="d-flex gap-2">
						<button
							className="btn btn-outline-primary"
							disabled={!profileLink}
							onClick={() => navigator.clipboard.writeText(profileLink)}
						>
							Copy
						</button>
						<button
							className="btn btn-outline-danger"
							onClick={async () => {
								if (!window.confirm('Regenerate profile link?')) return;
								const res = await api.post(`/members/${id}/regenerate-link`);
								setProfileLink(res.data.profileLink);
							}}
						>
							Regenerate
						</button>
					</div>
				</div>
			</div>

			{/* ACTION BUTTONS */}
			<div className="row g-2">
				<div className="col-md-3 col-12">
					<button
						className="btn btn-secondary w-100"
						onClick={() =>
							navigate(
								membership
									? `/admin/members/${id}/edit-membership`
									: `/admin/members/${id}/add-membership`
							)
						}
					>
						{membership ? 'Edit Membership' : 'Add Membership'}
					</button>
				</div>

				<div className="col-md-3 col-12">
					<button
						className="btn btn-primary w-100"
						onClick={() => navigate(`/admin/members/${id}/add-membership`)}
					>
						Add Next Membership
					</button>
				</div>

				<div className="col-md-3 col-12">
					<button
						className="btn btn-dark w-100"
						onClick={() => navigate(`/admin/members/${id}/membership-history`)}
					>
						Membership History
					</button>
				</div>

				<div className="col-md-3 col-12">
					<button
						className="btn btn-warning w-100"
						onClick={() => navigate(`/admin/members/${id}/edit`)}
					>
						Edit Member
					</button>
				</div>
			</div>
		</div>
	);
};

export default MemberDetails;
