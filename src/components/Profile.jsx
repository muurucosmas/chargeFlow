import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, MapPin } from "lucide-react";
import Sidebar from "./Sidebar";
import toast from "react-hot-toast";

function Profile() {
  const navigate = useNavigate();

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("user");
    toast.success("Logged out 👋");
    navigate("/");
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-6 text-center">
        <h1 className="text-2xl mb-4">You are not logged in</h1>

        <div className="flex gap-3">
          <Link
            to="/login"
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="border border-green-500 text-green-500 px-4 py-2 rounded-lg hover:bg-green-100"
          >
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Top navigation */}
      <div className="p-4 bg-white shadow flex justify-center">
        <Sidebar />
      </div>

      <h2 className="text-3xl font-bold text-center mt-8 mb-6">
        My Profile
      </h2>

      <div className="flex justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">

          <div className="flex flex-col items-center gap-4">

            <User size={70} className="text-green-500" />

            <h3 className="text-2xl font-bold text-center">
              {user.username || "User"}
            </h3>

            <p className="text-gray-500 text-center break-all">
              {user.email}
            </p>

            <Link
              to="/findcharger"
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <MapPin size={18} />
              Find Charging Station
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;