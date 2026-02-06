const Payment = () => {
  // demo completed payment data
  const payment = {
    invoiceId: "123abc",
    amount: 500,
    status: "SUCCESS",
    method: "RAZORPAY",
    paidAt: new Date().toLocaleString(),
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3 text-success">✅ Payment Completed</h3>

      <div className="card">
        <div className="card-body p-0">
          <table className="table table-bordered mb-0">
            <tbody>
              <tr>
                <th>Invoice ID</th>
                <td>{payment.invoiceId}</td>
              </tr>
              <tr>
                <th>Amount</th>
                <td>₹ {payment.amount}</td>
              </tr>
              <tr>
                <th>Status</th>
                <td>
                  <span className="badge bg-success">
                    {payment.status}
                  </span>
                </td>
              </tr>
              <tr>
                <th>Payment Method</th>
                <td>{payment.method}</td>
              </tr>
              <tr>
                <th>Paid At</th>
                <td>{payment.paidAt}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payment;