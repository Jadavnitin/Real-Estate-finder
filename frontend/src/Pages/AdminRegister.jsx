import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react"; // 👈 Install via: npm install lucide-react

const AdminRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" });
  };

  const validatePassword = (password) => {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const validateForm = () => {
    const errors = {};
    const { username, password, confirmPassword } = formData;

    if (!username.trim()) errors.username = "Username is required.";

    if (!password) {
      errors.password = "Password is required.";
    } else if (!validatePassword(password)) {
      errors.password =
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character.";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Confirm password is required.";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const { username, password } = formData;
      const response = await axios.post("http://localhost:5000/api/admin/register", {
        username,
        password,
      });

      toast.success("Admin registered successfully");
      localStorage.setItem("AdminName", response.data.admin.username);
      navigate("/admin/login");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <Toaster />
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
          Admin Register
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 text-gray-700">
          {/* Username */}
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="border w-full p-2 rounded"
            />
            {formErrors.username && (
              <p className="text-red-500 text-sm mt-1">{formErrors.username}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="border w-full p-2 pr-10 rounded"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </span>
            {formErrors.password && (
              <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="border w-full p-2 pr-10 rounded"
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
            >
              {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </span>
            {formErrors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{formErrors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-700 text-white py-2 rounded hover:bg-indigo-800"
          >
            Register
          </button>

          {/* Login Redirect */}
          <p className="text-sm text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/admin/login")}
              className="text-indigo-700 hover:underline"
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminRegister;
