import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, MapPin } from "lucide-react";
import Sidebar from "./Sidebar";
import toast from "react-hot-toast";

function Profile() {

  const navigate = useNavigate();

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (err) {
    user = null;
  }

  function handleLogout() {
    if (user) {
      localStorage.removeItem("user");
      toast.success("Logged out successfully 👋");
      navigate("/");
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-6">
        <h1 className="text-center text-2xl mb-4">
          No user logged in
        </h1>
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

      {/* Navbar / Sidebar */}
      <div className='p-4 bg-white shadow flex justify-center'>
        <Sidebar />
      </div>

      {/* Profile Header */}
      <h2 className="text-3xl font-bold text-center mt-8 mb-6">
        My Profile
      </h2>

      <div className="flex justify-center">

        <div className="bg-white p-8 rounded-xl shadow-lg w-96">

          <div className="flex flex-col items-center gap-4">

            <User
              size={70}
              className="text-green-500"
            />

            <h3 className="text-2xl font-bold">
              {user.username}
            </h3>

            <p className="text-gray-500">
              {user.email}
            </p>

            <Link
              to="/findcharger"
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <MapPin size={18} /> Find Charging Station
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
            >
              <LogOut size={18} /> Logout
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;