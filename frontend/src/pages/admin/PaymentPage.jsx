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
  const fetchInvoice = async () => {
    const res = await api.get(`/invoices/${invoiceId}`)
    setInvoice(res.data.invoice);
    setMember(res.data.member);
  };
  fetchInvoice();
}, [invoiceId]);

	// MAIN HANDLER
	const openPayment = () => {
		if (paymentMethod === 'RAZORPAY') openRazorpay();
		if (paymentMethod === 'CASH') saveCashPayment();
	};
	const handleModalOk = () => {
		setShowModal(false);
		navigate(`/member/profile/${member.secretKey}`);
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

	if (!invoice) return <h3 className="text-center mt-5">Loading...</h3>;

return (
  <div className="container d-flex justify-content-center align-items-center mt-5">
    <div className="card shadow-lg" style={{ maxWidth: '480px', width: '100%' }}>
      
      {/* HEADER */}
      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <span>💳 Payment</span>
        <button
          className="btn btn-sm btn-light"
          onClick={() => navigate(-1)}
        >
          ⬅ Back
        </button>
      </div>

      {/* BODY */}
      <div className="card-body">
        <h5 className="mb-3">
          Invoice: <span className="text-muted">{invoice.invoiceNumber}</span>
        </h5>

        <h3 className="text-success mb-4">
          ₹ {invoice.amount}
        </h3>

        <div className="mb-3">
          <label className="form-label fw-bold">
            Select Payment Method
          </label>

          <div className="form-check mb-2">
            <input
              className="form-check-input"
              type="radio"
              checked={paymentMethod === 'RAZORPAY'}
              onChange={() => setPaymentMethod('RAZORPAY')}
            />
            <label className="form-check-label">
              Razorpay (UPI / Card / Netbanking)
            </label>
          </div>

          {/* <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              checked={paymentMethod === 'CASH'}
              onChange={() => setPaymentMethod('CASH')}
            />
            <label className="form-check-label">
              Cash
            </label>
          </div> */}
        </div>

        <button
          className="btn btn-primary w-100 btn-lg mt-3"
          onClick={openPayment}
        >
          Pay Now
        </button>
      </div>
    </div>

    {/* MODAL */}
    {showModal && (
      <div style={styles.overlay}>
        <div style={styles.modal}>
          <div style={styles.icon}>
            {modalType === 'success' ? '✅' : '❌'}
          </div>

          <h4 style={{ color: modalType === 'success' ? '#16a34a' : '#dc2626' }}>
            {modalType === 'success' ? 'Payment Successful' : 'Payment Failed'}
          </h4>

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
