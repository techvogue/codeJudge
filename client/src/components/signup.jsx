import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'User',
    secretKey: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setErrorMessage('Please enter a valid email address.');
        setLoading(false);
        return;
      }

      if (formData.role === 'Admin' && formData.secretKey !== '2853') {
        setErrorMessage('Incorrect Secret Key.');
        setLoading(false);
        return;
      }

      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role === 'Admin' ? 1 : 0,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/signup`,
        payload
      );
      const { success } = response.data;

      if (success) {
        setErrorMessage('');
        navigate('/login');
      } else {
        setErrorMessage('Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during signup:', error.message);
      setErrorMessage('An error occurred. Please try again later.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-900 p-4">
      <div className="max-w-md w-full p-5 bg-stone-800 rounded-lg shadow-2xl border border-stone-700 font-sans">
        <h2 className="text-3xl font-bold mb-5 text-center text-white">Sign Up</h2>

        {errorMessage && (
          <div className="bg-red-900 text-red-300 px-4 py-3 rounded-md mb-6 text-sm text-center border border-red-800">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-4">
            <label htmlFor="username" className="block mb-2 text-stone-200 text-md px-1 font-medium">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-stone-700 rounded-md bg-stone-950 text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-200"
              placeholder="Enter your username"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-stone-200 text-md px-1 font-medium">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-stone-700 rounded-md bg-stone-950 text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-200"
              placeholder="Enter your email"
            />
          </div>

          {/* Password with toggle */}
          <div className="mb-4 relative">
            <label htmlFor="password" className="block mb-2  text-stone-200 text-md px-1 font-medium">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 pr-12 border border-stone-700 rounded-md bg-stone-950 text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-200"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center top-7 text-stone-400 hover:text-blue-500 focus:outline-none"
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>

          {/* Role */}
          <div className="mb-4">
            <label htmlFor="role" className="block mb-2 text-stone-200 text-md px-1 font-medium">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-stone-700 rounded-md bg-stone-950 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-200 appearance-none"
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {/* Secret Key */}
          {formData.role === 'Admin' && (
            <div className="mb-4">
              <label htmlFor="secretKey" className="block mb-2 text-stone-200 text-sm font-medium">Secret Key</label>
              <input
                type="password"
                id="secretKey"
                name="secretKey"
                value={formData.secretKey}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-stone-700 rounded-md bg-stone-950 text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-200"
                placeholder="Enter secret key"
              />
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-800 hover:bg-green-900 text-white font-semibold py-3 px-6 rounded-md transition duration-300 ease-in-out text-lg disabled:opacity-50 disabled:cursor-not-allowed tracking-wide border border-green-700"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        {/* Links */}
        <div className="mt-5 px-1 text-sm flex justify-between">
          <button
            className="text-blue-600 hover:text-blue-500 font-medium transition duration-200"
            onClick={() => navigate('/login')}
          >
            Already a Member? Login
          </button>
          {/* Removed the duplicate "Go to Login" button for cleaner UI */}
        </div>
      </div>
    </div>
  );
};

export default Signup;