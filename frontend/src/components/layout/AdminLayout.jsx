// components/layout/AdminLayout.jsx
import Sidebar from "../../components/sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import Breadcrumb from "../Breadcrumb";

const AdminLayout = () => {
  return (
    <>
      <Sidebar />

      <div
        style={{
          marginLeft: window.innerWidth > 768 ? "240px" : "0",
          paddingBottom: window.innerWidth <= 768 ? "70px" : "0",
          padding: "24px",
        }}
      >
        <Breadcrumb />
        <Outlet />
      </div>
    </>
  );
};

export default AdminLayout;