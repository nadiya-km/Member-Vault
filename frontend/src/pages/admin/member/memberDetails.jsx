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

	if (!member) return (
		<div className="oxford-page-wrapper d-flex align-items-center justify-content-center">
			<div className="spinner-border text-primary" />
		</div>
	);

	return (
		<div className="container-fluid p-0">
			<div className="d-flex justify-content-between align-items-center mb-4">
				<div>
					<h2 className="oxford-title fw-bold underline">Member Profile</h2>
					<p className="text-muted mb-0">Comprehensive view of member records</p>
				</div>
				<button className="btn-oxford-secondary" onClick={() => navigate(-1)}>
					<i className="bi bi-arrow-left me-2"></i>
					Back to List
				</button>
			</div>

			<div className="row g-4">
				{/* MEMBER INFO */}
				<div className="col-lg-12">
					<div className="oxford-card">
						<div className="oxford-card-header">
							<h5 className="mb-0 text-primary fw-bold">Personal Details</h5>
						</div>
						<div className="oxford-card-body">
							<div className="quota-list">
								<div className="detail-row px-2">
									<span className="detail-label">Full Name</span>
									<span className="detail-value text-dark fw-semibold">{member.name}</span>
								</div>
								<div className="detail-row px-2">
									<span className="detail-label">Email Address</span>
									<span className="detail-value">{member.email}</span>
								</div>
								<div className="detail-row px-2">
									<span className="detail-label">Primary Phone</span>
									<span className="detail-value">{member.phone}</span>
								</div>
								<div className="detail-row px-2">
									<span className="detail-label">WhatsApp Number</span>
									<span className="detail-value">{member.whatsappNumber}</span>
								</div>
								<div className="detail-row px-2">
									<span className="detail-label">Age</span>
									<span className="detail-value">{member.age} years</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* CURRENT MEMBERSHIP */}
				<div className="col-lg-12">
					<div className="oxford-card">
						<div className="oxford-card-header d-flex justify-content-between align-items-center">
							<h5 className="mb-0 text-success fw-bold">Active Membership</h5>
							{membership && (
								<span className="card-type-badge">
									{membership.status.replace('_', ' ').toUpperCase()}
								</span>
							)}
						</div>

						<div className="oxford-card-body">
							{loadingMembership ? (
								<div className="text-center py-4">
									<div className="spinner-border text-success" />
								</div>
							) : !membership ? (
								<div className="text-center py-4">
									<p className="text-muted">No active membership found</p>
									<button
										className="btn-oxford-primary"
										onClick={() => navigate(`/admin/members/${id}/add-membership`)}
									>
										Initialize Membership
									</button>
								</div>
							) : (
								<div className="quota-list">
									<div className="detail-row px-2">
										<span className="detail-label">Selected Plan</span>
										<span className="detail-value fw-bold text-primary">{membership.planId.name}</span>
									</div>
									<div className="detail-row px-2">
										<span className="detail-label">Billing Amount</span>
										<span className="detail-value fw-bold">₹{membership.planId.price}</span>
									</div>
									<div className="detail-row px-2">
										<span className="detail-label">Active Period</span>
										<span className="detail-value">
											{new Date(membership.startDate).toLocaleDateString()} - {new Date(membership.endDate).toLocaleDateString()}
										</span>
									</div>
									{membership.personalTrainer && (
										<div className="detail-row px-2">
											<span className="detail-label">Assigned Trainer</span>
											<span className="detail-value">{membership.personalTrainer.name}</span>
										</div>
									)}
								</div>
							)}
						</div>
					</div>
				</div>

				{/* PROFILE LINK */}
				<div className="col-lg-12">
					<div className="oxford-card">
						<div className="oxford-card-header">
							<h5 className="mb-0 fw-bold">Profile Access Control</h5>
						</div>
						<div className="oxford-card-body">
							<div className="input-group mb-3">
								<input
									className="form-control bg-light"
									value={profileLink || ''}
									readOnly
									style={{ borderStyle: 'dashed' }}
								/>
								<button
									className="btn btn-outline-primary"
									disabled={!profileLink}
									onClick={() => {
										navigator.clipboard.writeText(profileLink);
										alert('Copied!');
									}}
								>
									<i className="bi bi-clipboard me-1"></i> Copy
								</button>
							</div>
							<div className="d-flex justify-content-end">
								<button
									className="btn-danger-oxford px-4"
									onClick={async () => {
										if (!window.confirm('Securely regenerate this link?')) return;
										const res = await api.post(`/members/${id}/regenerate-link`);
										setProfileLink(res.data.profileLink);
									}}
								>
									<i className="bi bi-shield-refresh me-2"></i>
									Regenerate Secure Link
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* ACTION BUTTONS */}
				<div className="col-lg-12 mb-5">
					<div className="d-flex flex-wrap gap-3">
						<button
							className="btn-oxford-secondary flex-grow-1"
							onClick={() => navigate(membership ? `/admin/members/${id}/edit-membership` : `/admin/members/${id}/add-membership`)}
						>
							<i className="bi bi-pencil-square me-2"></i>
							{membership ? 'Modify Membership' : 'Add Membership'}
						</button>
						<button
							className="btn-oxford-primary flex-grow-1"
							onClick={() => navigate(`/admin/members/${id}/add-membership`)}
						>
							<i className="bi bi-arrow-repeat me-2"></i>
							Renew/Add Next
						</button>
						<button
							className="btn-oxford-secondary flex-grow-1"
							onClick={() => navigate(`/admin/members/${id}/membership-history`)}
						>
							<i className="bi bi-clock-history me-2"></i>
							Full History
						</button>
						<button
							className="btn-oxford-primary flex-grow-1"
							onClick={() => navigate(`/admin/members/${id}/edit`)}
						>
							<i className="bi bi-person-gear me-2"></i>
							Edit Member
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MemberDetails;
