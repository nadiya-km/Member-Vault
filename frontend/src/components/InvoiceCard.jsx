import { useNavigate } from 'react-router-dom';

const InvoiceCard = ({ invoice }) => {
  const navigate = useNavigate();

  const goToPayment = () => {
    navigate(`/payment/${invoice._id}`);
  };

  return (
    <button onClick={goToPayment}>
      Pay Now
    </button>
  );
};

export default InvoiceCard;
