
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

    if (!email.trim() || !password) {
      alert("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        alert("Login failed: " + error.message);
        return;
      }

      if (!data.user) {
        alert("Unable to verify your account. Please try again.");
        return;
      }

      if (loginType === "admin") {
        // Redirect to admin panel.
        // Ensure admin authorization is checked by your app.
        router.replace("/admin");
      } else {
        // Redirect to player dashboard.
        router.replace("/dashboard");
      }

      router.refresh();
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const activeButton =
    "py-3 rounded-lg font-semibold bg-white shadow";

  const inactiveButton =
    "py-3 rounded-lg font-semibold text-slate-600 hover:bg-white/60";

  const inputClass =
    "w-full bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900">
            🏏 Cricket Auction
          </h1>
          <p className="text-slate-600 mt-2">Login to continue</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="grid grid-cols-2 gap-2 bg-slate-100 rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => setLoginType("player")}
              className={`${
                loginType === "player" ? activeButton : inactiveButton
              } ${
                loginType === "player" ? "text-blue-600" : ""
              }`}
            >
              👤 Player Login
            </button>

            <button
              type="button"
              onClick={() => setLoginType("admin")}
              className={`${
                loginType === "admin" ? activeButton : inactiveButton
              } ${
                loginType === "admin" ? "text-red-600" : ""
              }`}
            >
              🔐 Admin Login
            </button>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
            {loginType === "admin" ? "🔐 Admin Login" : "👤 Player Login"}
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white font-bold py-4 rounded-lg transition disabled:opacity-60 ${
                loginType === "admin"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading
                ? "Logging in..."
                : loginType === "admin"
                  ? "Login as Admin"
                  : "Login as Player"}
            </button>
          </form>

          {loginType === "admin" && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-6">
              <p className="font-semibold text-red-800">
                🔐 Administrator Access
              </p>
              <p className="text-sm text-red-700 mt-1">
                Only authorized administrators can access the admin panel.
              </p>
            </div>
          )}

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