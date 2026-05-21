import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      // Fetch user by email
      const res = await fetch(`http://localhost:3001/users?email=${formData.email}`);
      if (!res.ok) throw new Error("Failed to fetch user");

      const data = await res.json();
      const user = data[0];

      if (!user) {
        toast.error("User not found", { duration: 1500 });
        setLoading(false);
        return;
      }

      if (user.password !== formData.password) {
        toast.error("Incorrect password", { duration: 1500 });
        setLoading(false);
        return;
      }

      // Save user in localStorage
      localStorage.setItem("user", JSON.stringify(user));

      //  Show success toast with short duration
      toast.success("Login successful", { duration: 1000 });

      //  Redirect after toast duration
      setTimeout(() => navigate("/profile"), 1000);

    } catch (err) {
      console.error(err);
      toast.error("Login failed. Try again.", { duration: 1500 });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">

      {/* Back button */}
      <div className="w-full max-w-md mb-4 flex items-center">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-700 hover:text-green-600"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back to Home</span>
        </button>
      </div>

      {/* Login form */}
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
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-2 pl-10 rounded-md outline-none focus:ring-2 focus:ring-green-400"
            required
          />
        </div>

        {/* Password */}
        <div className="relative">
          <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-2 pl-10 rounded-md outline-none focus:ring-2 focus:ring-green-400"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-700 flex items-center justify-center gap-2"
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