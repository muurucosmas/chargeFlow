import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { MapPin, CalendarDays } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  const [showAuth, setShowAuth] = useState(false);
  const [authMessage, setAuthMessage] = useState("");

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);

  const isAuthenticated = !!user;

  function requireAuth(action, message) {
    if (!isAuthenticated) {
      setAuthMessage(message);
      setShowAuth(true);
      toast.error("Login required");
      return;
    }
    action();
  }

  function handleFindChargeClick() {
    requireAuth(
      () => navigate("/findcharger"),
      "You need an account to access charging stations"
    );
  }

  function handleReservationsClick() {
    requireAuth(
      () => navigate("/reservations"),
      "You need an account to view reservations"
    );
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">

      <Toaster position="top-right" />

      {/* AUTH MODAL */}
      {showAuth && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">

          <div className="bg-white p-6 rounded-xl w-full max-w-sm text-center shadow-xl">

            <h2 className="text-2xl font-bold mb-2">
              Login Required
            </h2>

            <p className="text-gray-600 mb-6">
              {authMessage}
            </p>

            <div className="flex flex-col gap-3">

              <button
                onClick={() => navigate("/login")}
                className="bg-green-500 text-white py-2 rounded-lg"
              >
                Login
              </button>

              <button
                onClick={() => navigate("/signup")}
                className="border border-green-500 text-green-500 py-2 rounded-lg"
              >
                Create Account
              </button>

              <button
                onClick={() => setShowAuth(false)}
                className="text-gray-500 text-sm"
              >
                Cancel
              </button>

            </div>

          </div>

        </div>
      )}

      {/* MAIN ACTIONS */}
      <div className="flex flex-col gap-4">

        <button
          onClick={handleFindChargeClick}
          className="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <MapPin size={18} />
          Find Charging Station
        </button>

        <button
          onClick={handleReservationsClick}
          className="bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 flex items-center gap-2"
        >
          <CalendarDays size={18} />
          My Reservations
        </button>

      </div>

    </div>
  );
}