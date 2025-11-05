'use client';
import React, { useState } from 'react';
import Link from 'next/link';

const Login = () => {
  const [role, setRole] = useState('patient');

  return (
    <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(to_bottom,#CAF0F8,#ADE8F4,#90E0EF)] font-merriweather">
      <div className="bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-full max-w-md border border-[#00B4D8]/30">
        <h1 className="text-3xl font-bold text-center mb-3 text-[#03045E]">
          Welcome Back!
        </h1>
        <p className="text-center text-[#023E8A] mb-8">
          Login to your Golden Medical account
        </p>
        <div className="mb-6">
          <label className="block text-[#0077B6] font-semibold mb-2">
            Select Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 border border-[#48CAE4] rounded-md focus:ring-2 focus:ring-[#00B4D8] outline-none text-[#03045E] bg-[#E0F7FF]"
          >
            <option value="admin">Admin</option>
            <option value="doctor">Doctor</option>
            <option value="patient">Patient</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-[#0077B6] font-semibold mb-2">
            Username or Email
          </label>
          <input
            type="text"
            placeholder="Enter your username or email"
            className="w-full px-4 py-2 border border-[#48CAE4] rounded-md focus:ring-2 focus:ring-[#00B4D8] outline-none text-[#03045E]"
          />
        </div>
        <div className="mb-2">
          <label className="block text-[#0077B6] font-semibold mb-2">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full px-4 py-2 border border-[#48CAE4] rounded-md focus:ring-2 focus:ring-[#00B4D8] outline-none text-[#03045E]"
          />
        </div>
        <div className="text-right mb-6">
          <Link
            href="/forgot-password"
            className="text-sm text-[#0077B6] hover:text-[#0096C7] font-semibold transition"
          >
            Forgot Password?
          </Link>
        </div>
        <button className="w-full bg-[linear-gradient(to_right,#03045E,#0077B6,#00B4D8)] text-white py-2 rounded-md font-semibold hover:opacity-90 transition">
          Login
        </button>

        <p className="text-center text-[#023E8A] mt-6 text-sm">
          Don’t have an account?{' '}
          <Link
            href="/sign-up"
            className="text-[#0077B6] font-semibold hover:underline"
          >
            Register Now!
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
