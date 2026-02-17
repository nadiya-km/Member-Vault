import { useEffect, useState } from 'react';
import api from '../../services/api';

const Payment = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await api.get('/invoices/all');
      setInvoices(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch invoices', err);
      // Fallback for demo/missing endpoint
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PAID':
      case 'SUCCESS':
        return 'text-success bg-success-subtle';
      case 'PENDING':
        return 'text-warning bg-warning-subtle';
      case 'FAILED':
        return 'text-danger bg-danger-subtle';
      default:
        return 'text-dark bg-light';
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="mb-4">
        <h2 className="oxford-title fw-bold underline">Financial Records</h2>
        <p className="text-muted">Monitor and track all member transactions</p>
      </div>

      <div className="oxford-card">
        <div className="oxford-card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" />
              <p className="mt-2 text-muted">Synchronizing ledgers...</p>
            </div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-wallet2 display-4 text-muted"></i>
              <p className="text-muted mt-3">No payment records found in the database.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="ps-4">Invoice #</th>
                    <th>Member</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv._id}>
                      <td className="ps-4 fw-medium text-primary">{inv.invoiceNumber}</td>
                      <td>{inv.memberId?.name || 'Unknown'}</td>
                      <td className="fw-bold">₹{inv.amount}</td>
                      <td>
                        <span className="badge border text-dark bg-light px-2 py-1">
                          {inv.paymentMethod || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge px-3 py-2 rounded-pill ${getStatusColor(inv.status)}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="text-muted">
                        {new Date(inv.updatedAt || inv.createdAt).toLocaleDateString()}
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
  );
};

export default Payment;