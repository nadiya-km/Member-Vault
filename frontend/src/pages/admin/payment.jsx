import InvoiceCard from '../../components/InvoiceCard';

const Payment = () => {
  const invoice = {
    _id: '123abc', // test value
    amount: 500,
  };

  return (
    <div>
      <h1>Payment page</h1>
      <InvoiceCard invoice={invoice} />
    </div>
  );
};

export default Payment;
