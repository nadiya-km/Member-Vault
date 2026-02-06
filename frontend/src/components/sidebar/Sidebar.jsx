import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import secureLocalStorage from "react-secure-storage";
import "./sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    secureLocalStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside id="sidebar">
        <div>
          <h2 className="logo">Admin Panel</h2>

          <div className="links">
           <NavLink to="/dashboard" className={({ isActive }) =>
  `nav-link ${isActive ? "active" : ""}`
}>
  <i className="bi bi-speedometer2 me-2"></i> Dashboard
</NavLink>

<NavLink to="/plans" className={({ isActive }) =>
  `nav-link ${isActive ? "active" : ""}`
}>
  <i className="bi bi-box-seam me-2"></i> Plans
</NavLink>

<NavLink to="/members" className={({ isActive }) =>
  `nav-link ${isActive ? "active" : ""}`
}>
  <i className="bi bi-people me-2"></i> Members
</NavLink>

<NavLink to="/trainers" className={({ isActive }) =>
  `nav-link ${isActive ? "active" : ""}`
}>
  <i className="bi bi-person-badge me-2"></i> Trainers
</NavLink>

<NavLink to="/payments" className={({ isActive }) =>
  `nav-link ${isActive ? "active" : ""}`
}>
  <i className="bi bi-credit-card me-2"></i> Payments
</NavLink>
          </div>
        </div>

        <button className="logout" onClick={() => setShowLogoutModal(true)}>
          Logout
        </button>
      </aside>

      {/* MOBILE BOTTOM NAV */}
      <nav className="bottom-nav">
        <NavLink to="/dashboard" className={({ isActive }) =>
          `bottom-link ${isActive ? "active" : ""}`
        }>
         <span className="icon"><i className="bi bi-speedometer2"></i></span>
          <span className="text">Dashboard</span>
        </NavLink>

        <NavLink to="/plans" className={({ isActive }) =>
          `bottom-link ${isActive ? "active" : ""}`
        }>
          <span className="icon"><i className="bi bi-box-seam"></i></span>
          <span className="text">Plans</span>
        </NavLink>

        <NavLink to="/members" className={({ isActive }) =>
          `bottom-link ${isActive ? "active" : ""}`
        }>
        <span className="icon"><i className="bi bi-people"></i></span>
          <span className="text">Members</span>
        </NavLink>

        <NavLink to="/trainers" className={({ isActive }) =>
          `bottom-link ${isActive ? "active" : ""}`
        }>
          <span className="icon"><i className="bi bi-person-badge"></i></span>
          <span className="text">Trainers</span>
        </NavLink>

        <NavLink to="/payments" className={({ isActive }) =>
          `bottom-link ${isActive ? "active" : ""}`
        }>
          <span className="icon"><i className="bi bi-credit-card"></i></span>
          <span className="text">Payments</span>
        </NavLink>
      </nav>

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowLogoutModal(false)}>
                Cancel
              </button>
              <button className="btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
