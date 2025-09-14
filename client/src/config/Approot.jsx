import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { apiClient } from "@/lib/api-client";
import { GET_USER_INFO } from "@/utils/constants";
import { loginSuccess, logout } from "@/redux/slices/authSlice";

const AppRoot = ({ children }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await apiClient.get(GET_USER_INFO, {
          withCredentials: true,
        });

        if (response.data.success && response.data.message) {
          dispatch(loginSuccess(response.data.message)); // message = user object
        } else {
          dispatch(logout());
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        Loading...
      </div>
    );
  }

  return children;
};

export default AppRoot;
