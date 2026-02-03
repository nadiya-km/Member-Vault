import { Link, useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    secureLocalStorage.clear(); // removes all stored items
    navigate("/login", { replace: true });
  };

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>member-vault</h2>

      <div style={styles.links}>
        <Link to="/dashboard" style={styles.link}>Dashboard</Link>
        <Link to="/payment" style={styles.link}>Payment</Link>

        <button onClick={handleLogout} style={styles.logout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: "#000",
    color: "#fff",
    padding: "12px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: { margin: 0, fontSize: "20px" },
  links: { display: "flex", gap: "15px", alignItems: "center" },
  link: { color: "#fff", textDecoration: "none", fontWeight: "500" },
  logout: {
    background: "red",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    cursor: "pointer",
  },
};

export default Navbar;
