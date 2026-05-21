import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Loader2, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";

function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Controlled form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      // Use toast.promise for reliable toast + redirect
      await toast.promise(
        fetch("http://localhost:3001/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }).then(async res => {
          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            console.error("Signup failed:", errData);
            throw new Error("Signup failed");
          }
          return res.json();
        }),
        {
          loading: "Creating account...",
          success: "Account created successfully!",
          error: "Signup failed. Try again.",
        }
      );

      // Reset form
      setFormData({ username: "", email: "", password: "" });

      // Redirect to login after success
      navigate("/login");

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      {/* Back button */}
      <div
        className="w-full max-w-md mt-6 px-4 flex items-center cursor-pointer"
        onClick={() => navigate("/")}
      >
        <ArrowLeft size={22} className="mr-2" />
        <span>Back to Home</span>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md mt-6">
        <h2 className="text-2xl font-bold text-center mb-4">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div className="relative">
            <User className="absolute left-3 top-3" size={18} />
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full border p-2 pl-10 rounded"
              required
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3" size={18} />
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full border p-2 pl-10 rounded"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3" size={18} />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full border p-2 pl-10 rounded"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 cursor-pointer"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          {/* Submit button */}
          <button
            disabled={loading}
            className="w-full bg-green-500 text-white py-2 rounded flex justify-center items-center gap-2"
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