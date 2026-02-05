import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const PaymentPage = () => {
	const { invoiceId } = useParams();
	const navigate = useNavigate();

	const [invoice, setInvoice] = useState(null);
	const [member, setMember] = useState(null);
	const [paymentMethod, setPaymentMethod] = useState('RAZORPAY');

	// 🔔 Modal states
	const [showModal, setShowModal] = useState(false);
	const [modalType, setModalType] = useState('success');
	const [modalMessage, setModalMessage] = useState('');

	useEffect(() => {
		if (!invoiceId) {
			navigate('/dashboard');
			return;
		}

		setInvoice({
			_id: '65c1b9a2f1d4a6b123456789',
			amount: 500,
			invoiceNumber: 'INV-001',
		});

		setMember({
			_id: '65c1b9a2f1d4a6b987654321',
			name: 'Test User',
			email: 'test@mail.com',
			phone: '9999999999',
		});
	}, [invoiceId, navigate]);

	// MAIN HANDLER
	const openPayment = () => {
		if (paymentMethod === 'RAZORPAY') openRazorpay();
		if (paymentMethod === 'CASH') saveCashPayment();
	};
	const handleModalOk = () => {
		setShowModal(false);
		navigate('/dashboard');
	};

	// 🔴 RAZORPAY
	const openRazorpay = async () => {
		try {
			const res = await api.post('/payments/create-order', {
				amount: invoice.amount,
				invoiceId: invoice._id,
			});

			const options = {
				key: import.meta.env.VITE_RAZORPAY_KEY,
				amount: res.data.order.amount,
				currency: 'INR',
				name: 'Gym Membership',
				order_id: res.data.order.id,

				handler: async (response) => {
					try {
						const verify = await api.post('/payments/verify-payment', {
							invoiceId: invoice._id,
							memberId: member._id,
							amount: invoice.amount,
							method: 'UPI',
							razorpay_order_id: response.razorpay_order_id,
							razorpay_payment_id: response.razorpay_payment_id,
							razorpay_signature: response.razorpay_signature,
						});

						if (verify.data.success) {
							setModalType('success');
							setModalMessage(verify.data.message);
							setShowModal(true);
						} else {
							setModalType('error');
							setModalMessage(verify.data.message);
							setShowModal(true);
						}
					} catch (err) {
						setModalType('error');
						setModalMessage(err.response?.data?.message || 'Something went wrong');
						setShowModal(true);
					}
				},
			};

			new window.Razorpay(options).open();
		} catch {
			setModalType('error');
			setModalMessage('Razorpay initialization failed');
			setShowModal(true);
		}
	};

	// ⚫ CASH
	const saveCashPayment = async () => {
		try {
			await api.post('/payments/save-payment', {
				invoiceId: invoice._id,
				memberId: member._id,
				amount: invoice.amount,
				method: 'CASH',
			});

			setModalType('success');
			setModalMessage('Cash payment recorded');
			setShowModal(true);

			setTimeout(() => navigate('/dashboard'), 1500);
		} catch {
			setModalType('error');
			setModalMessage('Cash save failed');
			setShowModal(true);
		}
	};

	if (!invoice) return <h3>Loading...</h3>;

	return (
		<div>
			<h2>Invoice: {invoice.invoiceNumber}</h2>
			<h3>Amount: ₹{invoice.amount}</h3>

			<h4>Select Payment Method</h4>

			<label>
				<input
					type="radio"
					checked={paymentMethod === 'RAZORPAY'}
					onChange={() => setPaymentMethod('RAZORPAY')}
				/>
				Razorpay
			</label>

			<br />
			<br />

			<label>
				<input
					type="radio"
					checked={paymentMethod === 'CASH'}
					onChange={() => setPaymentMethod('CASH')}
				/>
				Cash
			</label>

			<br />
			<br />

			<button onClick={openPayment}>Pay Now</button>

			{showModal && (
				<div style={styles.overlay}>
					<div style={styles.modal}>
						<div style={styles.icon}>{modalType === 'success' ? '✅' : '❌'}</div>

						<h3 style={{ color: modalType === 'success' ? '#16a34a' : '#dc2626' }}>
							{modalType === 'success' ? 'Payment Successful' : 'Payment Failed'}
						</h3>

						<p style={styles.message}>{modalMessage}</p>

						<button style={styles.okBtn} onClick={handleModalOk}>
							OK
						</button>
					</div>
				</div>
			)}
		</div>
	);
};
const styles = {
	overlay: {
		position: 'fixed',
		inset: 0,
		background: 'rgba(0,0,0,0.6)',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 999,
	},
	modal: {
		background: '#fff',
		padding: '24px',
		borderRadius: '12px',
		width: '320px',
		textAlign: 'center',
		boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
		animation: 'fadeIn 0.3s ease',
	},
	icon: {
		fontSize: '40px',
		marginBottom: '10px',
	},
	message: {
		fontSize: '14px',
		color: '#555',
		margin: '12px 0 20px',
	},
	okBtn: {
		background: '#2563eb',
		color: '#fff',
		border: 'none',
		padding: '10px 24px',
		borderRadius: '6px',
		cursor: 'pointer',
		fontSize: '14px',
	},
};

export default PaymentPage;
