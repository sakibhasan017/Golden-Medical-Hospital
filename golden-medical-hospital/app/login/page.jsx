"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  const [role, setRole] = useState("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      role,
      redirect: false, 
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid credentials");
      return;
    }

    if (role === "admin") {
      router.replace("/dashboard/admin");
    } else {
      router.replace("/post-auth");
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/post-auth" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(to_bottom,#CAF0F8,#ADE8F4,#90E0EF)] font-merriweather">
      <div className="bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-full max-w-md border border-[#00B4D8]/30">
        <h1 className="text-3xl font-bold text-center mb-3 text-[#03045E]">
          Welcome Back!
        </h1>

        <p className="text-center text-[#023E8A] mb-8">
          Login to your Golden Medical account
        </p>

        {error && (
          <div className="mb-4 text-center bg-red-100 text-red-700 p-2 rounded">
            {error}
          </div>
        )}

        {/* Select Role */}
        <div className="mb-6">
          <label className="block text-[#0077B6] font-semibold mb-2">
            Select Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 border border-[#48CAE4] rounded-md bg-[#E0F7FF]"
          >
            <option value="admin">Admin</option>
            <option value="doctor">Doctor</option>
            <option value="patient">Patient</option>
          </select>
        </div>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-[#48CAE4] rounded-md mb-4"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-[#48CAE4] rounded-md mb-6"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-[linear-gradient(to_right,#03045E,#0077B6,#00B4D8)] text-white py-2 rounded-md font-semibold"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <button
          onClick={handleGoogleLogin}
          className="w-full mt-4 bg-white border border-[#48CAE4] text-[#023E8A] py-2 rounded-md font-semibold flex items-center justify-center gap-2"
        >
          <Image
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="google"
            width={20}
            height={20}
            unoptimized
          />
          Sign in with Google
        </button>

        <p className="text-center text-[#023E8A] mt-6 text-sm">
          Don’t have an account?{" "}
          <Link href="/sign-up" className="text-[#0077B6] font-semibold">
            Register Now!
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
