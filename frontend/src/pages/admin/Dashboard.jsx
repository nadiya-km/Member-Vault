import api from '../../services/api';
import { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';

const Dashboard = () => {
	const [admin, setAdmin] = useState(null);

	useEffect(() => {
		api.get('/dashboard').then((res) => {
			setAdmin(res.data.admin);
		});
	}, []);

	return (
		<AdminLayout>
			<h1>Welcome {admin?.email}</h1>
		</AdminLayout>
	);
};

export default Dashboard;
