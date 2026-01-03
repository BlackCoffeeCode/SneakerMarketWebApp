import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🔥 CHECK activeRole, NOT role
  if (user.activeRole !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
