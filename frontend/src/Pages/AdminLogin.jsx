import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react'; // 👈 install if not done: npm install lucide-react
import { AuthContext } from "../context/authContext";

const AdminLogin = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false); // 👈 Password toggle state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        newErrors.password =
          'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await axios.post('http://localhost:5000/api/admin/login', formData);
      const token = response.data.token;

      if (token) {
        toast.success('Login successful');
        login(token);
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1000);
      } else {
        toast.error('Login failed: No token received');
      }
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || 'Invalid credentials';
      toast.error(message);
    }
  };

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <form
          onSubmit={handleLogin}
          className="bg-white shadow-md rounded-2xl p-8 w-full max-w-sm"
        >
          <h2 className="text-2xl font-semibold text-indigo-700 mb-6 text-center">
            Admin Login
          </h2>

          {/* Username */}
          <div className="mb-4">
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="w-full px-4 py-2 border border-gray-300 rounded"
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          {/* Password with eye icon */}
          <div className="mb-6 relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded"
              value={formData.password}
              onChange={handleChange}
            />
            <span
              className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <Eye size={18}/> :  <EyeOff size={18} /> }
            </span>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
          >
            Login
          </button>

          {/* Link to Register */}
          <p className="mt-4 text-sm text-center text-gray-600">
            Don&apos;t have an account?{' '}
            <Link to="/admin/register" className="text-indigo-600 hover:underline">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default AdminLogin;
