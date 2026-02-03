import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../service/api';

const PaymentPage = () => {
  const { invoiceId } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [member, setMember] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('RAZORPAY');

  useEffect(() => {
  if (!invoiceId) {
    alert('Invalid payment request');
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
    if (paymentMethod === 'PHONEPE') openPhonePe();
    if (paymentMethod === 'CASH') saveCashPayment();
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
         await api.post('/payments/verify-payment', {
  invoiceId: invoice._id,
  memberId: member._id,   
  amount: invoice.amount,
  method: 'UPI',
  razorpay_order_id: response.razorpay_order_id,
  razorpay_payment_id: response.razorpay_payment_id,
  razorpay_signature: response.razorpay_signature,
});


          alert('Razorpay Payment Successful ✅');
          navigate('/dashboard');
        },
      };

      new window.Razorpay(options).open();
    } catch {
      alert('Razorpay Payment Failed ❌');
    }
  };

  // 🟢 PHONEPE
  const openPhonePe = async () => {
    try {
      const res = await api.post('/payments/phonepe/create', {
        invoiceId: invoice._id,
        amount: invoice.amount,
        memberId: member._id,
      });

      window.location.href = res.data.redirectUrl;
    } catch {
      alert('PhonePe init failed ❌');
    }
  };

  // ⚫ CASH (OFFLINE)
  const saveCashPayment = async () => {
    try {
      await api.post('/payments/save-payment', {
        invoiceId: invoice._id,
        memberId: member._id,
        amount: invoice.amount,
        method: 'CASH',
        transactionId: 'CASH-' + Date.now(),
      });

      alert('Cash payment recorded ');
      navigate('/dashboard');
    } catch {
      alert('Cash save failed ❌');
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

      <label>
        <input
          type="radio"
          checked={paymentMethod === 'PHONEPE'}
          onChange={() => setPaymentMethod('PHONEPE')}
        />
        PhonePe
      </label>

      <br />

      <label>
        <input
          type="radio"
          checked={paymentMethod === 'CASH'}
          onChange={() => setPaymentMethod('CASH')}
        />
        Cash
      </label>

      <br /><br />

      <button onClick={openPayment}>
        Pay Now
      </button>
    </div>
  );
};

export default PaymentPage;
