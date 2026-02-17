import React from 'react';

const InvoicePrint = ({ invoice, member, membership, onClose }) => {
    if (!invoice || !member) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="invoice-print-overlay d-print-none" style={styles.overlay}>
            <div className="oxford-card d-print-block shadow-2xl" style={styles.modal}>
                <div className="oxford-card-header d-flex justify-content-between align-items-center d-print-none">
                    <h5 className="mb-0 fw-bold">Invoice Preview</h5>
                    <button className="btn-close" onClick={onClose}></button>
                </div>

                <div className="oxford-card-body p-5">
                    {/* INVOICE HEADER */}
                    <div className="d-flex justify-content-between mb-5">
                        <div>
                            <h2 className="oxford-title fw-bold mb-1">MEMBER VAULT</h2>
                            <p className="text-muted small mb-0">Premium Fitness Studio</p>
                        </div>
                        <div className="text-end">
                            <h4 className="fw-bold text-primary mb-1">INVOICE</h4>
                            <p className="mb-0">#{invoice.invoiceNumber}</p>
                            <p className="text-muted small">{new Date(invoice.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <hr className="my-4" />

                    {/* BILL TO */}
                    <div className="row mb-5">
                        <div className="col-6">
                            <h6 className="oxford-label text-uppercase small ls-1">Billed To</h6>
                            <h5 className="fw-bold mb-1">{member.name}</h5>
                            <p className="text-muted mb-1">{member.email}</p>
                            <p className="text-muted">{member.phone}</p>
                        </div>
                        <div className="col-6 text-end">
                            <h6 className="oxford-label text-uppercase small ls-1">Payment Details</h6>
                            <p className="mb-1"><strong>Status:</strong> {invoice.status}</p>
                            <p className="mb-1"><strong>Method:</strong> {invoice.paymentMethod || 'N/A'}</p>
                        </div>
                    </div>

                    {/* ITEMS TABLE */}
                    <div className="table-responsive mb-5">
                        <table className="table table-borderless">
                            <thead className="bg-light">
                                <tr>
                                    <th className="ps-3 py-3">Description</th>
                                    <th className="text-end pe-3 py-3">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="ps-3 py-3">
                                        <div className="fw-bold">{membership?.planId?.name || 'Membership Subscription'}</div>
                                        <small className="text-muted">Subscription Fee</small>
                                    </td>
                                    <td className="text-end pe-3 py-3 fw-bold">₹{invoice.amount}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="row justify-content-end mb-5">
                        <div className="col-md-5">
                            <div className="d-flex justify-content-between py-2 px-3 bg-primary text-white rounded">
                                <span className="fw-bold">Total Paid</span>
                                <span className="fw-bold fs-5">₹{invoice.amount}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 text-center text-muted small">
                        <p>Thank you for choosing Member Vault. Stay healthy, stay fit!</p>
                        <p className="mb-0">Computer generated invoice. No signature required.</p>
                    </div>
                </div>

                <div className="oxford-card-body bg-light border-top text-center d-print-none">
                    <button className="btn-oxford-primary px-5" onClick={handlePrint}>
                        <i className="bi bi-printer me-2"></i> Print or Download PDF
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        zIndex: 1050,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px'
    },
    modal: {
        width: '100%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflowY: 'auto',
        backgroundColor: '#fff'
    }
};

export default InvoicePrint;
