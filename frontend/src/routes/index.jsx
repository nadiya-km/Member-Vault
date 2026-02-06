import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Dashboard from '../pages/admin/Dashboard';
import PaymentPage from '../pages/admin/PaymentPage';
import Payment from '../pages/admin/payment';
import Sidebar from '../components/sidebar/Sidebar';
import Login from '../pages/auth/Login';
import ProtectedRoute from './ProtectedRoute';
import Trainers from '../pages/admin/Trainers';
import MembershipPlans from '../pages/admin/MembershipPlans';
import Member from '../pages/admin/member/members';
import MemberDetails from '../pages/admin/member/MemberDetails';
import AddMembership from '../pages/admin/member/addMembership';
import EditMembership from '../pages/admin/member/editMembership';
import MemberProfile from '../pages/member/profile';

const AppRoutes = () => {
	const location = useLocation();

	// Hide navbar on login page
const hideSidebar =
	location.pathname === '/login' || location.pathname.startsWith('/member/profile');


	return (
		<>
			{!hideSidebar && <Sidebar />}

			<Routes>
				{/* Default */}
				<Route path="/" element={<Navigate to="/login" />} />

				{/* Auth */}
				<Route path="/login" element={<Login />} />

				{/* Protected Pages */}
				<Route
					path="/dashboard"
					element={
						<ProtectedRoute>
							<Dashboard />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/plans"
					element={
						<ProtectedRoute>
							<MembershipPlans />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/payment"
					element={
						<ProtectedRoute>
							<Payment />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/trainers"
					element={
						<ProtectedRoute>
							<Trainers />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/members"
					element={
						<ProtectedRoute>
							<Member />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/admin/members/:id"
					element={
						<ProtectedRoute>
							<MemberDetails />
						</ProtectedRoute>
					}
				/>
				<Route path="/admin/members/:id/edit-membership" element={<EditMembership />} />
				<Route path="/member/profile/:secretKey" element={<MemberProfile />} />
				<Route
					path="/admin/members/:id/add-membership"
					element={
						<ProtectedRoute>
							<AddMembership />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/payment/:invoiceId"
					element={
						<ProtectedRoute>
							<PaymentPage />
						</ProtectedRoute>
					}
				/>

				{/* Fallback */}
				<Route path="*" element={<h2>Page Not Found</h2>} />
			</Routes>
		</>
	);
};

export default AppRoutes;
