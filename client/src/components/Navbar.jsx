import { useState } from "react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import { logout } from "@/redux/slices/authSlice";
import { LOGOUT_USER, UPDATE_USERINFO } from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    // add other fields if needed
  });

  const handleLogout = async () => {
    const response = await apiClient.get(LOGOUT_USER, { withCredentials: true });
    if (response.data.success) {
      dispatch(logout());
      toast.success("User has been logged out");
      navigate("/auth");
    } else {
      toast.error("Logout failed! Try again");
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const response = await apiClient.patch(`${UPDATE_USERINFO}`, formData, { withCredentials: true });
      console.log(response);
      if (response.data.success) {
        toast.success("Profile updated successfully!");
        setShowModal(false);
        window.location.reload();
      } else {
        toast.error("Update failed!");
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong!");
    }
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "";

  return (
    <nav className="w-full bg-white border-b shadow-sm px-6 py-4 flex items-center justify-between">
      {/* Logo / Brand */}
      <div
        className="text-xl md:text-2xl font-bold text-purple-700 cursor-pointer"
        onClick={() => navigate("/")}
      >
        FilmHive
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {user ? (
          <>
            {/* User Initial Circle */}
            <div
              className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-500 text-white font-semibold text-lg cursor-pointer"
              onClick={() => setShowModal(true)}
            >
              {userInitial}
            </div>

            <Button
              onClick={() => navigate("/movies/watchlist")}
              className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
            >
              Wishlist
            </Button>
            <Button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
            >
              Logout
            </Button>
          </>
        ) : (
          location.pathname !== "/auth" && (
            <Button
              onClick={() => navigate("/auth")}
              className="bg-black hover:bg-gray-800 text-white cursor-pointer"
            >
              Join us!
            </Button>
          )
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 relative">
            <h2 className="text-xl font-semibold mb-4">Update Profile</h2>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Name"
              className="w-full border p-2 rounded mb-3"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="w-full border p-2 rounded mb-3"
            />
            {/* add other fields if needed */}

            <div className="flex justify-end gap-3 mt-4">
              <Button onClick={() => setShowModal(false)} className="bg-gray-300 hover:bg-gray-400 text-black cursor-pointer">
                Cancel
              </Button>
              <Button onClick={handleUpdate} className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer">
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
