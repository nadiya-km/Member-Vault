import { NavLink, useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import "./sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

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
              📊 Dashboard
            </NavLink>

            <NavLink to="/plans" className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }>
              📦 Plans
            </NavLink>

            <NavLink to="/members" className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }>
              👥 Members
            </NavLink>

            <NavLink to="/trainers" className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }>
              🏋️ Trainers
            </NavLink>

            <NavLink to="/payments" className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }>
              💳 Payments
            </NavLink>
          </div>
        </div>

        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* MOBILE BOTTOM NAV */}
      <nav className="bottom-nav">
        <NavLink to="/dashboard" className={({ isActive }) =>
          `bottom-link ${isActive ? "active" : ""}`
        }>
          <span className="icon">📊</span>
          <span className="text">Dashboard</span>
        </NavLink>

        <NavLink to="/plans" className={({ isActive }) =>
          `bottom-link ${isActive ? "active" : ""}`
        }>
          <span className="icon">📦</span>
          <span className="text">Plans</span>
        </NavLink>

        <NavLink to="/members" className={({ isActive }) =>
          `bottom-link ${isActive ? "active" : ""}`
        }>
          <span className="icon">👥</span>
          <span className="text">Members</span>
        </NavLink>

        <NavLink to="/trainers" className={({ isActive }) =>
          `bottom-link ${isActive ? "active" : ""}`
        }>
          <span className="icon">🏋️</span>
          <span className="text">Trainers</span>
        </NavLink>

        <NavLink to="/payments" className={({ isActive }) =>
          `bottom-link ${isActive ? "active" : ""}`
        }>
          <span className="icon">💳</span>
          <span className="text">Payments</span>
        </NavLink>
      </nav>
    </>
  );
};

export default Sidebar;
