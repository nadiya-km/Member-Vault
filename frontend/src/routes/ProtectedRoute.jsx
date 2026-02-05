import { Navigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

const ProtectedRoute = ({ children }) => {
  const token = secureLocalStorage.getItem("accessToken");
  return token ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
