"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");

  useEffect(() => {
    const loggedIn = localStorage.getItem("userLoggedIn");
    const savedEmail = localStorage.getItem("userEmail");

    if (!loggedIn) {
      router.push("/login");
      return;
    }

    setEmail(savedEmail || "");
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("userLoggedIn");
    localStorage.removeItem("userEmail");

    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-slate-100">

      {/* Navbar */}
      <nav className="bg-slate-950 text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">

          <h1 className="text-xl font-bold">
            🏏 Cricket Auction
          </h1>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg"
          >
            Logout
          </button>

        </div>
      </nav>

      {/* Main Dashboard */}
      <section className="max-w-7xl mx-auto px-6 py-10">

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">
            Welcome to your Dashboard 👋
          </h2>

          <p className="text-slate-500 mt-2">
            {email}
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white rounded-2xl p-6 shadow">
            <p className="text-slate-500">
              Registration Status
            </p>

            <h3 className="text-2xl font-bold text-yellow-600 mt-2">
              Pending
            </h3>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow">
            <p className="text-slate-500">
              Payment Status
            </p>

            <h3 className="text-2xl font-bold text-red-600 mt-2">
              Not Paid
            </h3>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow">
            <p className="text-slate-500">
              Auction Status
            </p>

            <h3 className="text-2xl font-bold text-blue-600 mt-2">
              Upcoming
            </h3>
          </div>

        </div>

        {/* Profile */}
        <div className="bg-white rounded-2xl shadow mt-8 p-6">

          <h3 className="text-2xl font-bold text-slate-900 mb-6">
            My Profile
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <p className="text-sm text-slate-500">
                Full Name
              </p>

              <p className="font-semibold text-slate-800 mt-1">
                Not Provided
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Email
              </p>

              <p className="font-semibold text-slate-800 mt-1">
                {email}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Mobile Number
              </p>

              <p className="font-semibold text-slate-800 mt-1">
                Not Provided
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                City
              </p>

              <p className="font-semibold text-slate-800 mt-1">
                Not Provided
              </p>
            </div>

          </div>

        </div>

        {/* Auction Registration */}
        <div className="bg-blue-600 text-white rounded-2xl shadow mt-8 p-8">

          <h3 className="text-2xl font-bold">
            Ready for the Auction? 🏏
          </h3>

          <p className="mt-2 text-blue-100">
            Complete your profile and register for the upcoming
            cricket auction.
          </p>

          <button
  onClick={() => router.push("/register")}
  className="mt-6 bg-white text-blue-600 font-bold px-6 py-3 rounded-lg hover:bg-blue-50"
>
  Register for Auction
</button>

        </div>

      </section>

    </main>
  );
}