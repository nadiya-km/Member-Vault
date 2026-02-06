import api from '../../services/api';
import { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';

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
    <AdminLayout>
      {/* CSS INSIDE SAME FILE */}
      <style>{`
        .dashboard {
          padding: 20px;
        }

        .welcome-text {
          font-size: 1.6rem;
          font-weight: 700;
          margin-bottom: 24px;
          color: #111827;
        }

        .welcome-text span {
          color: #2563eb;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          padding: 20px;
          border-radius: 16px;
          color: #fff;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
          transition: transform 0.25s ease;
        }

        .stat-card:hover {
          transform: translateY(-4px);
        }

        .stat-card.blue {
          background: linear-gradient(135deg, #2563eb, #1e40af);
        }

        .stat-icon {
          font-size: 2.6rem;
          margin-right: 16px;
        }

        .stat-info h3 {
          font-size: 0.95rem;
          margin-bottom: 6px;
          opacity: 0.9;
        }

        .stat-info p {
          font-size: 1.9rem;
          font-weight: 800;
        }
		  
      `}</style>

     <div className="dashboard">
  <h1 className="welcome-text">
    Admin Dashboard, 
  </h1>

  <div className="stats-row">
    <div className="stat-card blue full">
      <div className="stat-icon">
        <i className="bi bi-people-fill"></i>
      </div>
      <div className="stat-info">
        <h3>Total Members</h3>
        <p>{totalMembers}</p>
      </div>
    </div>
  </div>
</div>
    </AdminLayout>
  );
};

export default Dashboard;