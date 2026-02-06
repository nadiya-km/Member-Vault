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
      {/* ===== DESKTOP SIDEBAR ===== */}
      <aside className="sidebar">
        <div>
          {/* HEADER */}
          <div className="sidebar-header">
            <div className="icon-wrap">
              <i className="bi bi-credit-card-2-front-fill"></i>
            </div>
            <h5>Admin Panel</h5>
            <small>Management</small>
          </div>

          {/* LINKS */}
          <div className="links">
            <NavLink to="/admin/dashboard" className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }>
              <i className="bi bi-speedometer2"></i>
              Dashboard
            </NavLink>

            <NavLink to="/admin/plans" className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }>
              <i className="bi bi-box-seam"></i>
              Plans
            </NavLink>

            <NavLink to="/admin/members" className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }>
              <i className="bi bi-people"></i>
              Members
            </NavLink>

            <NavLink to="/admin/trainers" className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }>
              <i className="bi bi-person-badge"></i>
              Trainers
            </NavLink>

            <NavLink to="/admin/payments" className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }>
              <i className="bi bi-credit-card"></i>
              Payments
            </NavLink>
          </div>
        </div>

        <button className="logout" onClick={() => setShowLogoutModal(true)}>
          Logout
        </button>
      </aside>

      {/* ===== MOBILE BOTTOM NAV ===== */}
    <nav className="bottom-nav">
  {[
    ["dashboard", "speedometer2", "Dashboard"],
    ["plans", "box-seam", "Plans"],
    ["members", "people", "Members"],
    ["trainers", "person-badge", "Trainers"],
    ["payments", "credit-card", "Payments"],
  ].map(([path, icon, label]) => (
    <NavLink
      key={path}
      to={`/admin/${path}`}   // ✅ FIX
      className={({ isActive }) =>
        `bottom-link ${isActive ? "active" : ""}`
      }
    >
      <i className={`bi bi-${icon}`}></i>
      <span>{label}</span>
    </NavLink>
  ))}
</nav>

      {/* ===== LOGOUT MODAL ===== */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="modal-actions">
              <button onClick={() => setShowLogoutModal(false)}>Cancel</button>
              <button className="danger" onClick={handleLogout}>
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