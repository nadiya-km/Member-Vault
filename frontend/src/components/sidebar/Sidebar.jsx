import { NavLink, useNavigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import './sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) backdrop.remove();

    document.body.classList.remove('modal-open');
    document.body.style.overflow = 'auto';

    secureLocalStorage.clear();
    navigate('/login', { replace: true });
  };

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <nav id="sidebar">
        <h2 className="logo">Admin Panel</h2>

        <div className="links">
          <NavLink to="/dashboard" className={({ isActive }) =>
            `nav-link ${isActive ? 'active' : ''}`
          }>Dashboard</NavLink>

          <NavLink to="/plans" className={({ isActive }) =>
            `nav-link ${isActive ? 'active' : ''}`
          }>Plans</NavLink>

          <NavLink to="/members" className={({ isActive }) =>
            `nav-link ${isActive ? 'active' : ''}`
          }>Members</NavLink>

          <NavLink to="/trainers" className={({ isActive }) =>
            `nav-link ${isActive ? 'active' : ''}`
          }>Trainers</NavLink>

          <NavLink to="/payments" className={({ isActive }) =>
            `nav-link ${isActive ? 'active' : ''}`
          }>Payments</NavLink>
        </div>

        <button className="logout" data-bs-toggle="modal" data-bs-target="#logoutModal">
          Logout
        </button>
      </nav>

      {/* MOBILE BOTTOM NAV */}
      <nav className="bottom-nav">
        <NavLink to="/dashboard">🏠</NavLink>
        <NavLink to="/plans">📦</NavLink>
        <NavLink to="/members">👥</NavLink>
        <NavLink to="/trainers">🏋️</NavLink>
        <NavLink to="/payments">💳</NavLink>
      </nav>

      {/* LOGOUT MODAL */}
      <div className="modal fade" id="logoutModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-dark text-white">
              <h5>Confirm Logout</h5>
              <button className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body text-center">
              Are you sure you want to logout?
            </div>

            <div className="modal-footer justify-content-center">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
