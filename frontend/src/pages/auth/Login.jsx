import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import secureLocalStorage from 'react-secure-storage';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const login = async () => {
		try {
			setLoading(true);
			const res = await api.post('/auth/login', { email, password });

			if (res.data.success) {
				secureLocalStorage.setItem('accessToken', res.data.accessToken);
				secureLocalStorage.setItem('refreshToken', res.data.refreshToken);
				navigate('/admin/dashboard', { replace: true });
			}
		} catch (err) {
			alert('Invalid credentials');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
			<div className="col-11 col-sm-8 col-md-5 col-lg-4">
				<div className="card shadow-lg border-0 rounded-4">
					<div className="card-body p-4 p-md-5">
						<h3 className="text-center fw-bold mb-4">Admin Login</h3>

						<div className="mb-3">
							<label className="form-label">Email</label>
							<input
								type="email"
								className="form-control "
								placeholder=" "
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>

						<div className="mb-4">
							<label className="form-label">Password</label>
							<input
								type="password"
								className="form-control "
								placeholder=" "
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>

						<button className="btn btn-primary btn-lg w-100" onClick={login} disabled={loading}>
							{loading ? 'Logging in...' : 'Login'}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
