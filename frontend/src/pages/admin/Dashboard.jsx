import api from '../../services/api';
import { useEffect, useState } from 'react';


const Dashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [totalMembers, setTotalMembers] = useState(0);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/members/dashboard');
        setAdmin(res.data.admin);
        setTotalMembers(res.data.totalMembers);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="container-fluid p-0">
      <div className="mb-4">
        <h2 className="oxford-title fw-bold underline">Admin Dashboard</h2>
        <p className="text-muted">Welcome back, {admin?.name || 'Administrator'}</p>
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="oxford-card h-100" style={{ borderLeft: '4px solid var(--midnight)' }}>
            <div className="oxford-card-body d-flex align-items-center">
              <div className="rounded-circle p-3 me-3" style={{ background: 'linear-gradient(135deg, var(--midnight), var(--ocean))' }}>
                <i className="bi bi-people-fill text-white fs-3"></i>
              </div>
              <div>
                <h6 className="oxford-label mb-1">Total Members</h6>
                <p className="h3 mb-0 fw-bold text-dark">{totalMembers}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="oxford-card h-100" style={{ borderLeft: '4px solid var(--ocean)' }}>
            <div className="oxford-card-body d-flex align-items-center">
              <div className="rounded-circle p-3 me-3" style={{ background: 'rgba(91, 136, 178, 0.2)' }}>
                <i className="bi bi-cash-stack text-primary fs-3"></i>
              </div>
              <div>
                <h6 className="oxford-label mb-1">Active Plans</h6>
                <p className="h3 mb-0 fw-bold text-dark">-</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;