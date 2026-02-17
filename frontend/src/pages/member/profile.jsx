import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import InvoicePrint from '../../components/member/InvoicePrint';

const MemberProfile = () => {
	const { secretKey } = useParams();
	const navigate = useNavigate();

	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [selectedInvoice, setSelectedInvoice] = useState(null);

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
		return (
			<div className="d-flex justify-content-center align-items-center vh-100">
				<div className="spinner-border text-primary" role="status">
					<span className="visually-hidden">Loading Profile...</span>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="container-oxford d-flex justify-content-center align-items-center">
				<div className="oxford-card p-5 text-center" style={{ maxWidth: '500px' }}>
					<i className="bi bi-shield-lock-fill text-danger display-1 mb-4"></i>
					<h3 className="oxford-title text-danger mb-3">Access Denied</h3>
					<p className="text-muted">{error}</p>
				</div>
			</div>
		);
	}

	const { member, membership, invoices = [] } = data;
	const isPaymentDue = membership && membership.status === 'pending_payment';

	return (
		<div className="oxford-page-wrapper">
			<div className="container-oxford" style={{ maxWidth: '1200px', margin: '0 auto' }}>
				<div className="d-flex justify-content-between align-items-center mb-5">
					<div>
						<h2 className="oxford-title fw-bold underline">Member Dashboard</h2>
						<p className="text-muted mb-0">Welcome back, <span className="text-dark fw-bold">{member.name}</span></p>
					</div>
				</div>

				<div className="row g-4">
					{/* LEFT COLUMN: INFO & INVOICES */}
					<div className="col-lg-8">
						{/* PERSONAL INFO CARD */}
						<div className="oxford-card mb-4">
							<div className="oxford-card-header">
								<h5 className="mb-0 text-primary fw-bold">
									<i className="bi bi-person-circle me-2"></i>Personal Profile
								</h5>
							</div>
							<div className="oxford-card-body">
								<div className="quota-list">
									<div className="detail-row">
										<span className="detail-label">Email Address</span>
										<span className="detail-value">{member.email}</span>
									</div>
									<div className="detail-row">
										<span className="detail-label">Primary Phone</span>
										<span className="detail-value">{member.phone}</span>
									</div>
									<div className="detail-row">
										<span className="detail-label">WhatsApp Contact</span>
										<span className="detail-value">{member.whatsappNumber}</span>
									</div>
									<div className="detail-row">
										<span className="detail-label">Age</span>
										<span className="detail-value">{member.age} years</span>
									</div>
								</div>
							</div>
						</div>

						{/* INVOICE HISTORY CARD */}
						<div className="oxford-card">
							<div className="oxford-card-header">
								<h5 className="mb-0 text-primary fw-bold">
									<i className="bi bi-receipt me-2"></i>Invoice History
								</h5>
							</div>
							<div className="oxford-card-body p-0">
								{invoices.length === 0 ? (
									<div className="text-center py-5">
										<i className="bi bi-inbox text-muted display-4"></i>
										<p className="text-muted mt-2">No invoices generated yet</p>
									</div>
								) : (
									<div className="table-responsive">
										<table className="table table-hover align-middle mb-0">
											<thead className="bg-light">
												<tr>
													<th className="ps-4">Invoice #</th>
													<th>Date</th>
													<th>Amount</th>
													<th>Status</th>
													<th className="text-end pe-4">Action</th>
												</tr>
											</thead>
											<tbody>
												{invoices.map((inv) => (
													<tr key={inv._id}>
														<td className="ps-4 fw-medium">#{inv.invoiceNumber}</td>
														<td>{new Date(inv.createdAt).toLocaleDateString()}</td>
														<td className="fw-bold">₹{inv.amount}</td>
														<td>
															<span className={`badge rounded-pill px-3 ${inv.status === 'PAID' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'
																}`}>
																{inv.status}
															</span>
														</td>
														<td className="text-end pe-4">
															<button
																className="btn btn-sm btn-outline-primary rounded-pill px-3"
																onClick={() => setSelectedInvoice(inv)}
															>
																<i className="bi bi-eye me-1"></i> View
															</button>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								)}
							</div>
						</div>
					</div>

					{/* RIGHT COLUMN: MEMBERSHIP STATUS */}
					<div className="col-lg-4">
						<div className="oxford-card h-100 shadow-lg">
							<div className="oxford-card-header bg-primary text-white">
								<h5 className="mb-0 fw-bold">Membership Status</h5>
							</div>
							<div className="oxford-card-body">
								{membership ? (
									<div className="text-center">
										<div className="mb-4">
											<span
												className={`badge rounded-pill fs-6 px-4 py-2 ${membership.status === 'active'
														? 'bg-success'
														: membership.status === 'pending_payment'
															? 'bg-warning text-dark'
															: 'bg-secondary'
													}`}
											>
												{membership.status.replace('_', ' ').toUpperCase()}
											</span>
										</div>


										<h3 className="fw-bold text-dark mb-1">{membership.planId?.name}</h3>
										<p className="text-muted mb-4">Valid till {new Date(membership.endDate).toDateString()}</p>

										<hr className="my-4" />

										{membership.personalTrainer && (
											<div className="p-3 bg-light rounded-3 mb-4 text-start">
												<h6 className="oxford-label mb-2">Assigned Trainer</h6>
												<div className="d-flex align-items-center">
													<div className="bg-primary-subtle p-2 rounded-circle me-3">
														<i className="bi bi-person-badge text-primary"></i>
													</div>
													<div>
														<div className="fw-bold">{membership.personalTrainer.name}</div>
														<div className="small text-muted">{membership.personalTrainer.phone}</div>
													</div>
												</div>
											</div>
										)}

										{isPaymentDue && (
											<div className="alert alert-warning border-warning border-dashed mb-0">
												<h6 className="fw-bold text-warning-emphasis mb-2">Payment Pending</h6>
												<p className="small mb-3">Complete your payment of ₹{membership.amountDue || membership.planId?.price} to activate this plan.</p>
												<button
													className="btn-oxford-primary w-100"
													onClick={() => navigate(`/payment/${membership.invoiceId}`)}
												>
													<i className="bi bi-credit-card me-2"></i> Pay Now
												</button>
											</div>
										)}
									</div>
								) : (
									<div className="text-center py-5">
										<i className="bi bi-dash-circle text-muted display-4"></i>
										<p className="text-muted mt-3">No active membership found</p>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* INVOICE MODAL */}
			{selectedInvoice && (
				<InvoicePrint
					invoice={selectedInvoice}
					member={member}
					membership={membership}
					onClose={() => setSelectedInvoice(null)}
				/>
			)}
		</div>
	);
};

export default MemberProfile;
