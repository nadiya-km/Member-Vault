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
		<div className="oxford-page-wrapper d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, var(--midnight) 0%, #1a3a63 50%, #234977 100%)' }}>
			<div className="col-11 col-sm-8 col-md-5 col-lg-4">
				<div className="oxford-card shadow-2xl border-0">
					<div className="oxford-card-body p-4 p-md-5">
						<div className="text-center mb-4">
							<div className="mb-3 d-inline-block p-3 rounded-circle" style={{ background: 'linear-gradient(135deg, var(--midnight), var(--ocean))' }}>
								<i className="bi bi-shield-lock-fill text-white fs-1"></i>
							</div>
							<h3 className="oxford-title fw-bold">Admin Portal</h3>
							<p className="text-muted small">Enter your credentials to manage MemberVault</p>
						</div>

						<div className="mb-3">
							<label className="oxford-label">Email Address</label>
							<input
								type="email"
								className="form-control"
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>

						<div className="mb-4">
							<label className="oxford-label">Password</label>
							<input
								type="password"
								className="form-control"
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>

						<button
							className="btn-oxford-primary w-100 py-3"
							onClick={login}
							disabled={loading}
							style={{ fontSize: '1.1rem' }}
						>
							{loading ? (
								<>
									<span className="spinner-border spinner-border-sm me-2" />
									Authenticating...
								</>
							) : 'Sign In to Dashboard'}
						</button>

						
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
