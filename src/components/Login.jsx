import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";

const API_URL = "http://localhost:3001/users";

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}?email=${formData.email}`);
      if (!res.ok) throw new Error("Network error");

      const [user] = await res.json();

      if (!user) {
        toast.error("Account not found");
        return;
      }

      if (user.password !== formData.password) {
        toast.error("Wrong password");
        return;
      }

      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Welcome back 👋");

      navigate("/profile");

    } catch (err) {
      console.error(err);
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">

      {/* Back */}
      <button
        onClick={() => navigate("/")}
        className="mb-4 flex items-center gap-2 text-gray-700 hover:text-green-600"
      >
        <ArrowLeft size={18} />
        Back to Home
      </button>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>

        {/* Email */}
        <div className="relative">
          <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border p-2 pl-10 rounded-md focus:ring-2 focus:ring-green-400 outline-none"
            required
          />
        </div>

        {/* Password */}
        <div className="relative">
          <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full border p-2 pl-10 rounded-md focus:ring-2 focus:ring-green-400 outline-none"
            required
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-700 flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>
      </form>
    </div>
  );
}

export default Login;