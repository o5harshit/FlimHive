import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const ProtectedAuthRoute = ({ children }) => {
  const userInfo = useSelector((state) => state.adminAuth.admin);
  const isAuthenticated = !!userInfo;
  console.log(isAuthenticated);
  if (isAuthenticated) {
    // Redirect logged-in users to the dashboard or another protected page
    return <Navigate to="/admin-dashboard" replace />;
  }

  return children;
};
