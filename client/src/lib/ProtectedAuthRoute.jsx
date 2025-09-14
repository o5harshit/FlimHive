import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const ProtectedAuthRoute = ({ children }) => {
const userInfo = useSelector((state) => state.auth.user);
  const isAuthenticated = !!userInfo;
  console.log(isAuthenticated);
  if (isAuthenticated) {
    return <Navigate to="/movies" replace />;
  }

  return children;
};
