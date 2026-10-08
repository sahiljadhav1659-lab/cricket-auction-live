"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { supabase } from "../../lib/supabase/client";

type Player = {
  id: number;
  registration_id: string;
  name: string;
  email: string;
  mobile: string;
  dob: string;
  city: string;
  role: string;
  experience: string;
  address: string;
  registration_fee: number;
  payment_method: string;
  transaction_id: string | null;
  payment_status: string;
  auction_status: string;
  created_at: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPlayer();
  }, []);

  const loadPlayer = async () => {
    try {
      setLoading(true);

      const registrationId =
        localStorage.getItem("registrationId");

      if (!registrationId) {
        router.push("/register");
        return;
      }

      const { data, error } = await supabase
        .from("players")
        .select("*")
        .eq("registration_id", registrationId)
        .single();

      if (error) {
        console.error(error);
        alert("Could not load your registration details.");
        return;
      }

      setPlayer(data);
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const refreshStatus = async () => {
    try {
      setRefreshing(true);

      const registrationId =
        localStorage.getItem("registrationId");

      if (!registrationId) {
        router.push("/register");
        return;
      }

      const { data, error } = await supabase
        .from("players")
        .select("*")
        .eq("registration_id", registrationId)
        .single();

      if (error) {
        console.error(error);
        alert("Could not refresh status.");
        return;
      }

      setPlayer(data);

      alert("Status refreshed successfully!");
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setRefreshing(false);
    }
  };

  // ==============================
  // DOWNLOAD MY REGISTRATION EXCEL
  // ==============================
  const downloadMyExcel = () => {
    if (!player) {
      alert("Player data is not available.");
      return;
    }

    const excelData = [
      {
        "Registration ID": player.registration_id,
        "Full Name": player.name,
        Email: player.email,
        Mobile: player.mobile,
        "Date of Birth": player.dob,
        City: player.city,
        "Cricket Role": player.role,
        Experience: player.experience,
        Address: player.address,
        "Registration Fee": player.registration_fee,
        "Payment Method": player.payment_method,
        "UTR / Transaction ID":
          player.transaction_id || "Not submitted",
        "Payment Status": player.payment_status,
        "Auction Status": player.auction_status,
        "Registration Date": player.created_at,
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "My Registration"
    );

    XLSX.writeFile(
      workbook,
      `${player.registration_id}_Registration.xlsx`
    );

    alert("Excel file downloaded successfully!");
  };

  const handleLogout = () => {
    localStorage.removeItem("userLoggedIn");
    localStorage.removeItem("userEmail");

    router.push("/login");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🏏</div>

          <p className="text-slate-600 font-medium">
            Loading your dashboard...
          </p>
        </div>
      </main>
    );
  }

  if (!player) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-slate-900">
            Registration Not Found
          </h2>

          <p className="text-slate-600 mt-3">
            We could not find your registration details.
          </p>

          <button
            onClick={() => router.push("/register")}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg"
          >
            Register Now
          </button>
        </div>
      </main>
    );
  }

  const isPaid = player.payment_status === "Paid";
  const isRejected = player.payment_status === "Rejected";
  const isConfirmed = player.auction_status === "Confirmed";

  return (
    <main className="min-h-screen bg-slate-100">

      {/* Navbar */}
      <nav className="bg-slate-950 text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">

          <div>
            <h1 className="text-xl font-bold">
              🏏 Cricket Auction
            </h1>

            <p className="text-xs text-slate-400">
              Player Dashboard
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold"
          >
            Logout
          </button>

        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">
            Welcome, {player.name}! 👋
          </h2>

          <p className="text-slate-600 mt-2">
            Here you can check your registration, payment and auction status.
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

          {/* Registration */}
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-slate-500 text-sm">
              Registration ID
            </p>

            <p className="text-2xl font-bold text-blue-600 mt-2">
              {player.registration_id}
            </p>

            <p className="text-xs text-slate-500 mt-2">
              Keep this ID safe.
            </p>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-slate-500 text-sm">
              Payment Status
            </p>

            <div className="mt-3">
              <span
                className={`inline-block px-4 py-2 rounded-full font-bold text-sm ${
                  isPaid
                    ? "bg-green-100 text-green-700"
                    : isRejected
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {player.payment_status}
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-3">
              Registration Fee: ₹{player.registration_fee}
            </p>
          </div>

          {/* Auction */}
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-slate-500 text-sm">
              Auction Status
            </p>

            <div className="mt-3">
              <span
                className={`inline-block px-4 py-2 rounded-full font-bold text-sm ${
                  isConfirmed
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {player.auction_status}
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-3">
              {isConfirmed
                ? "You are eligible for the auction."
                : "Waiting for payment verification."}
            </p>
          </div>

        </div>

        {/* Payment Message */}
        {player.payment_status === "Pending" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8">

            <div className="flex items-start gap-4">

              <div className="text-3xl">
                ⏳
              </div>

              <div>
                <h3 className="text-lg font-bold text-yellow-800">
                  Payment Verification Pending
                </h3>

                <p className="text-yellow-700 mt-1">
                  Your payment details have been submitted successfully.
                  An administrator will verify your UTR / transaction ID.
                </p>

                <p className="text-sm text-yellow-700 mt-2">
                  Your auction status will become{" "}
                  <strong>Confirmed</strong> after payment approval.
                </p>
              </div>

            </div>

          </div>
        )}

        {/* Approved Message */}
        {player.payment_status === "Paid" && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8">

            <div className="flex items-start gap-4">

              <div className="text-3xl">
                🎉
              </div>

              <div>
                <h3 className="text-lg font-bold text-green-800">
                  Payment Approved!
                </h3>

                <p className="text-green-700 mt-1">
                  Your ₹50 registration payment has been verified by the
                  administrator.
                </p>

                <p className="text-sm text-green-700 mt-2 font-semibold">
                  🏏 You are confirmed for the Cricket Auction.
                </p>
              </div>

            </div>

          </div>
        )}

        {/* Rejected Message */}
        {player.payment_status === "Rejected" && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">

            <div className="flex items-start gap-4">

              <div className="text-3xl">
                ❌
              </div>

              <div>
                <h3 className="text-lg font-bold text-red-800">
                  Payment Rejected
                </h3>

                <p className="text-red-700 mt-1">
                  Your payment could not be verified by the administrator.
                </p>

                <p className="text-sm text-red-700 mt-2">
                  Please contact the auction administrator for assistance.
                </p>
              </div>

            </div>

          </div>
        )}

        {/* Player Information */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">

          <div className="bg-slate-950 text-white px-6 py-5">
            <h3 className="text-xl font-bold">
              👤 Player Information
            </h3>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <p className="text-sm text-slate-500">
                Full Name
              </p>

              <p className="font-semibold text-slate-900 mt-1">
                {player.name}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Email
              </p>

              <p className="font-semibold text-slate-900 mt-1">
                {player.email}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Mobile
              </p>

              <p className="font-semibold text-slate-900 mt-1">
                {player.mobile}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Date of Birth
              </p>

              <p className="font-semibold text-slate-900 mt-1">
                {player.dob}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                City
              </p>

              <p className="font-semibold text-slate-900 mt-1">
                {player.city}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Cricket Role
              </p>

              <p className="font-semibold text-slate-900 mt-1">
                {player.role}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Playing Experience
              </p>

              <p className="font-semibold text-slate-900 mt-1">
                {player.experience}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Address
              </p>

              <p className="font-semibold text-slate-900 mt-1">
                {player.address}
              </p>
            </div>

          </div>

        </div>

        {/* Payment Information */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">

          <div className="bg-slate-950 text-white px-6 py-5">
            <h3 className="text-xl font-bold">
              💳 Payment Information
            </h3>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">

            <div>
              <p className="text-sm text-slate-500">
                Registration Fee
              </p>

              <p className="font-bold text-xl text-blue-600 mt-1">
                ₹{player.registration_fee}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Payment Method
              </p>

              <p className="font-semibold text-slate-900 mt-1">
                {player.payment_method || "Not submitted"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                UTR / Transaction ID
              </p>

              <p className="font-mono text-sm font-semibold text-slate-900 mt-1 break-all">
                {player.transaction_id || "Not submitted"}
              </p>
            </div>

          </div>

        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">

          <button
            onClick={refreshStatus}
            disabled={refreshing}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold px-8 py-3 rounded-lg transition"
          >
            {refreshing
              ? "Refreshing..."
              : "🔄 Refresh Status"}
          </button>

          <button
            onClick={() => router.push("/payment")}
            className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-8 py-3 rounded-lg transition"
          >
            💳 View Payment Page
          </button>

          <button
            onClick={downloadMyExcel}
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-lg transition"
          >
            📥 Download My Excel
          </button>

        </div>

      </div>
    </main>
  );
}