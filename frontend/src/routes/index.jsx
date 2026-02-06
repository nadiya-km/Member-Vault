import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import ProtectedRoute from "./ProtectedRoute";

import AdminLayout from "../components/layout/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import Trainers from "../pages/admin/Trainers";
import MembershipPlans from "../pages/admin/MembershipPlans";
import Member from "../pages/admin/member/members";
import MemberDetails from "../pages/admin/member/MemberDetails";
import AddMembership from "../pages/admin/member/addMembership";
import EditMembership from "../pages/admin/member/editMembership";
import Payment from "../pages/admin/payment";
import PaymentPage from "../pages/admin/PaymentPage";
import MemberProfile from "../pages/member/profile";
import EditMember from "../pages/admin/member/EditMember"; 

const AppRoutes = () => {
  return (
    <Routes>
  {/* Auth */}
  <Route path="/login" element={<Login />} />

  {/* Member profile (public) */}
  <Route path="/member/profile/:secretKey" element={<MemberProfile />} />

+ {/* Public Payment Page (NO admin layout) */}
+ <Route path="/payment/:invoiceId" element={<PaymentPage />} />

  {/* Admin Layout */}
  <Route
    path="/admin"
    element={
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    }
  >
    <Route index element={<Navigate to="dashboard" />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="plans" element={<MembershipPlans />} />
    <Route path="members" element={<Member />} />
    <Route path="members/:id" element={<MemberDetails />} />
    <Route path="members/:id/add-membership" element={<AddMembership />} />
    <Route path="members/:id/edit-membership" element={<EditMembership />} />
    <Route path="trainers" element={<Trainers />} />
    <Route path="payments" element={<Payment />} />
-   <Route path="payments/:invoiceId" element={<PaymentPage />} />
    <Route path="members/:id/edit" element={<EditMember />} />
  </Route>

  <Route path="*" element={<Navigate to="/login" />} />
</Routes>
  );
};

export default AppRoutes;