import api from '../../services/api';
import { useEffect, useState } from 'react';


const Dashboard = () => {
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState({
    totalMembers: 0,
    activePlans: 0,
    totalTrainers: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/members/dashboard');
        setAdmin(res.data.admin);
        setStats({
          totalMembers: res.data.totalMembers || 0,
          activePlans: res.data.activePlans || 0,
          totalTrainers: res.data.totalTrainers || 0,
          totalRevenue: res.data.totalRevenue || 0
        });
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
        <div className="col-md-3">
          <div className="oxford-card h-100" style={{ borderLeft: '4px solid var(--midnight)' }}>
            <div className="oxford-card-body d-flex align-items-center">
              <div className="rounded-circle p-3 me-3" style={{ background: 'linear-gradient(135deg, var(--midnight), var(--ocean))', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="bi bi-people-fill text-white fs-4"></i>
              </div>
              <div>
                <h6 className="oxford-label mb-1">Total Members</h6>
                <p className="h3 mb-0 fw-bold text-dark">{stats.totalMembers}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="oxford-card h-100" style={{ borderLeft: '4px solid var(--ocean)' }}>
            <div className="oxford-card-body d-flex align-items-center">
              <div className="rounded-circle p-3 me-3" style={{ background: 'rgba(91, 136, 178, 0.2)', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="bi bi-card-checklist text-primary fs-4"></i>
              </div>
              <div>
                <h6 className="oxford-label mb-1">Active Plans</h6>
                <p className="h3 mb-0 fw-bold text-dark">{stats.activePlans}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="oxford-card h-100" style={{ borderLeft: '4px solid #10b981' }}>
            <div className="oxford-card-body d-flex align-items-center">
              <div className="rounded-circle p-3 me-3" style={{ background: 'rgba(16, 185, 129, 0.2)', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="bi bi-person-badge text-success fs-4"></i>
              </div>
              <div>
                <h6 className="oxford-label mb-1">Trainers</h6>
                <p className="h3 mb-0 fw-bold text-dark">{stats.totalTrainers}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="oxford-card h-100" style={{ borderLeft: '4px solid #f59e0b' }}>
            <div className="oxford-card-body d-flex align-items-center">
              <div className="rounded-circle p-3 me-3" style={{ background: 'rgba(245, 158, 11, 0.2)', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="bi bi-currency-rupee text-warning fs-4"></i>
              </div>
              <div>
                <h6 className="oxford-label mb-1">Total Revenue</h6>
                <p className="h3 mb-0 fw-bold text-dark">₹{stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;