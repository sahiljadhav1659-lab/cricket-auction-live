"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();

  const [loginType, setLoginType] = useState<"player" | "admin">("player");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      // =========================
      // ADMIN LOGIN
      // =========================
      if (loginType === "admin") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          alert("Admin login failed: " + error.message);
          return;
        }

        alert("Admin login successful!");

        router.push("/admin");
        return;
      }

      // =========================
      // PLAYER LOGIN
      // =========================
      localStorage.setItem("userLoggedIn", "true");
      localStorage.setItem("userEmail", email);

      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900">
            🏏 Cricket Auction
          </h1>

          <p className="text-slate-600 mt-2">
            Login to continue
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">

          {/* Login Type */}
          <div className="grid grid-cols-2 gap-2 bg-slate-100 rounded-xl p-1 mb-6">

            <button
              type="button"
              onClick={() => setLoginType("player")}
              className={`py-3 rounded-lg font-semibold transition ${
                loginType === "player"
                  ? "bg-white text-blue-600 shadow"
                  : "text-slate-600"
              }`}
            >
              👤 Player Login
            </button>

            <button
              type="button"
              onClick={() => setLoginType("admin")}
              className={`py-3 rounded-lg font-semibold transition ${
                loginType === "admin"
                  ? "bg-white text-red-600 shadow"
                  : "text-slate-600"
              }`}
            >
              🔐 Admin Login
            </button>

          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
            {loginType === "admin"
              ? "🔐 Admin Login"
              : "👤 Player Login"}
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white font-bold py-4 rounded-lg transition ${
                loginType === "admin"
                  ? "bg-red-600 hover:bg-red-700 disabled:bg-red-400"
                  : "bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400"
              }`}
            >
              {loading
                ? "Logging in..."
                : loginType === "admin"
                ? "Login as Admin"
                : "Login as Player"}
            </button>

          </form>

          {/* Admin Info */}
          {loginType === "admin" && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-6">
              <p className="font-semibold text-red-800">
                🔐 Administrator Access
              </p>

              <p className="text-sm text-red-700 mt-1">
                Only authorized administrators can access the admin panel
                and verify player payments.
              </p>
            </div>
          )}

          {/* Back */}
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Home
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}