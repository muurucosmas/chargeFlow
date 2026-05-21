import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Loader2,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import { toast } from "react-hot-toast";

const API_URL = "http://localhost:3001/users";

function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
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
      await toast.promise(
        fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }).then(async (res) => {
          if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            throw new Error(error.message || "Signup failed");
          }
          return res.json();
        }),
        {
          loading: "Creating account...",
          success: "Account created successfully 🎉",
          error: "Signup failed. Try again.",
        }
      );

      setFormData({ username: "", email: "", password: "" });

      navigate("/login");

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 px-4">

      {/* Back */}
      <button
        onClick={() => navigate("/")}
        className="w-full max-w-md mt-6 flex items-center gap-2 text-gray-700 hover:text-green-600"
      >
        <ArrowLeft size={20} />
        Back to Home
      </button>

      {/* Form */}
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md mt-6">

        <h2 className="text-2xl font-bold text-center mb-4">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Username */}
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full border p-2 pl-10 rounded focus:ring-2 focus:ring-green-400 outline-none"
              required
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full border p-2 pl-10 rounded focus:ring-2 focus:ring-green-400 outline-none"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />

            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full border p-2 pl-10 rounded focus:ring-2 focus:ring-green-400 outline-none"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-3 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Submit */}
          <button
            disabled={loading}
            className="w-full bg-green-500 text-white py-2 rounded flex items-center justify-center gap-2 hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Creating...
              </>
            ) : (
              "Sign Up"
            )}
          </button>

        </form>
      </div>
    </div>
  );
}

export default Signup;