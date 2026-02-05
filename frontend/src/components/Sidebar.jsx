

import { NavLink, useNavigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';

const Sidebar = () => {
	const navigate = useNavigate();

	const handleLogout = () => {
		secureLocalStorage.clear();
		navigate('/login', { replace: true });
	};

	return (
		<nav style={styles.sidebar}>
			{/* Logo / Title */}
			<div>
				<h2 style={styles.logo}>Admin Panel</h2>

				<div style={styles.links}>
					<NavLink to="/dashboard" style={styles.link}>
					Dashboard
				</NavLink>

				<NavLink to="/plans" style={styles.link}>
					Plans
				</NavLink>

				<NavLink to="/members" style={styles.link}>
					Members
				</NavLink>

				<NavLink to="/trainers" style={styles.link}>
					Trainers
				</NavLink>

				<NavLink to="/payments" style={styles.link}>
					Payments
				</NavLink>

				
				</div>
			</div>

			{/* Bottom user + logout */}
			<div style={styles.bottom}>
				
				<button onClick={handleLogout} style={styles.logout}>
					Logout
				</button>
			</div>
		</nav>
	);
};

const styles = {
	sidebar: {
		width: '240px',
		height: '100vh',
		background: '#f7f7f7',
		borderRight: '1px solid #ddd',
		padding: '20px',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		position: 'fixed',
		left: 0,
		top: 0,
	},

	logo: {
		marginBottom: '25px',
		fontSize: '22px',
		fontWeight: '600',
	},

	links: {
		display: 'flex',
		flexDirection: 'column',
		gap: '12px',
	},

	link: {
		padding: '12px',
		borderRadius: '8px',
		background: '#fff',
		color: '#000',
		textDecoration: 'none',
		border: '1px solid #e0e0e0',
	},

	invoice: {
		padding: '12px',
		borderRadius: '8px',
		background: '#ff3b5c',
		color: '#fff',
		textDecoration: 'none',
		border: 'none',
	},

	bottom: {
		textAlign: 'center',
	},

	user: {
		marginBottom: '10px',
		fontWeight: '500',
	},

	logout: {
		width: '100%',
		padding: '10px',
		border: '1px solid #ccc',
		background: '#fff',
		cursor: 'pointer',
		borderRadius: '8px',
	},
};

export default Sidebar;

