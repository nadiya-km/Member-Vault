import { NavLink, useNavigate } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';

const Navbar = () => {
	const navigate = useNavigate();

	const handleLogout = () => {
		secureLocalStorage.clear();
		navigate('/login', { replace: true });
	};

	return (
		<nav style={styles.nav}>
			<h2 style={styles.logo}>Member-Vault</h2>

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

				<button onClick={handleLogout} style={styles.logout}>
					Logout
				</button>
			</div>
		</nav>
	);
};

const styles = {
	nav: {
		backgroundColor: '#000',
		color: '#fff',
		padding: '12px 20px',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	logo: {
		margin: 0,
		fontSize: '20px',
		fontWeight: 'bold',
	},
	links: {
		display: 'flex',
		gap: '16px',
		alignItems: 'center',
	},
	link: ({ isActive }) => ({
		color: isActive ? '#00e0ff' : '#fff',
		textDecoration: 'none',
		fontWeight: '500',
	}),
	logout: {
		background: 'red',
		color: '#fff',
		border: 'none',
		padding: '6px 12px',
		cursor: 'pointer',
		borderRadius: '4px',
	},
};

export default Navbar;
