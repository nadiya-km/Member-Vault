// components/layout/AdminLayout.jsx
import Sidebar from "../../components/sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import Breadcrumb from "../Breadcrumb";

const AdminLayout = () => {
  return (
    <div className="oxford-page-wrapper">
      <Sidebar />

      <div
        className="main-content-area"
        style={{
          marginLeft: window.innerWidth > 768 ? "240px" : "0",
          paddingBottom: window.innerWidth <= 768 ? "70px" : "0",
        }}
      >
        <div className="p-4">
          <Breadcrumb />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;