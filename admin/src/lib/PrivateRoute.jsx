import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export const PrivateRoute = ({ children }) => {
  const userInfo = useSelector((state) => state.adminAuth.admin);
  const isAuthenticated = !!userInfo;
  const location = useLocation();
  console.log(isAuthenticated);

  if (!isAuthenticated) {
    // Save the last visited path, except for the login/auth page
    localStorage.setItem("lastVisitedPath", location.pathname);

    return <Navigate to="/login" replace />;
  }

  return children;
};

