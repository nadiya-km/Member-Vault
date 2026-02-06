import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const MemberProfile = () => {
	const { secretKey } = useParams();
	const navigate = useNavigate();

	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const res = await api.get(`/members/profile/${secretKey}`);
				setData(res.data.data);
			} catch (err) {
				setError('Invalid or expired profile link');
			} finally {
				setLoading(false);
			}
		};

		fetchProfile();
	}, [secretKey]);

	if (loading) {
		return <div className="container mt-4">Loading profile...</div>;
	}

	if (error) {
		return <div className="container mt-4 text-danger">{error}</div>;
	}

	const { member, membership } = data;

	const isPaymentDue = membership && membership.status === 'pending_payment';

	return (
		<div className="container mt-4" style={{ maxWidth: '1100px' }}>
			<h2 className="mb-4 fw-bold">My Profile</h2>

			<div className="row g-4">
				{/* LEFT COLUMN */}
				<div className="col-md-8">
					{/* MEMBER INFO */}
					<div className="card shadow-sm mb-4">
						<div className="card-header bg-light fw-bold">Personal Information</div>
						<div className="card-body">
							<p>
								<strong>Name:</strong> {member.name}
							</p>
							<p>
								<strong>Email:</strong> {member.email}
							</p>
							<p>
								<strong>Phone:</strong> {member.phone}
							</p>
							<p>
								<strong>WhatsApp:</strong> {member.whatsappNumber}
							</p>
							<p className="mb-0">
								<strong>Age:</strong> {member.age}
							</p>
						</div>
					</div>

					{/* MEMBERSHIP INFO */}
					<div className="card shadow-sm">
						<div className="card-header d-flex justify-content-between align-items-center bg-light">
							<span className="fw-bold">Membership Details</span>

							{membership && (
								<span
									className={`badge px-3 py-2 ${
										membership.status === 'active' ? 'bg-success' : 'bg-warning text-dark'
									}`}
							 	>
									{membership.status.replace('_', ' ').toUpperCase()}
								</span>
							)}
						</div>

						<div className="card-body">
							{membership ? (
								<>
									<p>
										<strong>Plan:</strong> {membership.planId?.name}
									</p>
									<p>
										<strong>Valid Till:</strong> {new Date(membership.endDate).toDateString()}
									</p>

									{membership.personalTrainer && (
										<div className="alert alert-info mt-3 mb-0">
											<p className="mb-1">
												<strong>Trainer:</strong> {membership.personalTrainer.name}
											</p>
											<p className="mb-0">
												<strong>Phone:</strong> {membership.personalTrainer.phone}
											</p>
										</div>
									)}
								</>
							) : (
								<p>No active membership</p>
							)}
						</div>
					</div>
				</div>

				{/* RIGHT COLUMN – PAYMENT */}
				<div className="col-md-4">
					{isPaymentDue && membership && (
						<div className="card shadow-lg border-warning position-sticky" style={{ top: '20px' }}>
							<div className="card-header bg-warning fw-bold text-center">⚠️ Payment Pending</div>

							<div className="card-body">
								<p>
									<strong>Plan:</strong> {membership.planId?.name}
								</p>

								{membership.amountDue && (
									<p className="fs-5">
										<strong>Amount:</strong>{' '}
										<span className="text-danger">₹{membership.amountDue}</span>
									</p>
								)}

								<p className="text-muted">Complete payment to activate your membership.</p>

								<button
									className="btn btn-primary w-100 btn-lg mt-3"
									onClick={() => navigate(`/payment/${membership.invoiceId}`)}
								>
									Pay Now
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);

};

export default MemberProfile;
