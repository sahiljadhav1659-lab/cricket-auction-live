"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
  const router = useRouter();

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const registration = localStorage.getItem("auctionRegistration");

    if (!registration) {
      router.push("/register");
      return;
    }

    const data = JSON.parse(registration);

    setUserName(data.name || "");
    setEmail(data.email || "");
  }, [router]);

  const handlePayment = () => {
    const registrationId =
      "CA-" + Math.floor(100000 + Math.random() * 900000);

    localStorage.setItem("paymentStatus", "Paid");
    localStorage.setItem("registrationId", registrationId);

    alert("Payment successful! Registration confirmed.");

    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-lg">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900">
            🏏 Cricket Auction
          </h1>

          <p className="text-slate-500 mt-2">
            Auction Registration Payment
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">

          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Payment Details
          </h2>

          {/* User Information */}
          <div className="space-y-4 mb-6">

            <div>
              <p className="text-sm text-slate-500">
                Participant Name
              </p>

              <p className="font-semibold text-slate-900">
                {userName}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Email
              </p>

              <p className="font-semibold text-slate-900">
                {email}
              </p>
            </div>

          </div>

          {/* Fee */}
          <div className="border-t border-b border-slate-200 py-5 mb-6">

            <div className="flex justify-between items-center">

              <span className="text-slate-600">
                Auction Registration Fee
              </span>

              <span className="text-2xl font-bold text-slate-900">
                ₹500
              </span>

            </div>

          </div>

          {/* Payment Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">

            <p className="text-sm text-yellow-800">
              This is a demo payment. No real money will be charged.
            </p>

          </div>

          {/* Pay Button */}
          <button
            onClick={handlePayment}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg transition"
          >
            Pay ₹500 & Confirm Registration
          </button>

          <button
            onClick={() => router.push("/dashboard")}
            className="w-full mt-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-3 rounded-lg"
          >
            Cancel
          </button>

        </div>

      </div>

    </main>
  );
}
