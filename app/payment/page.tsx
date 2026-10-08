"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase/client";

export default function PaymentPage() {
  const router = useRouter();

  const [registrationId, setRegistrationId] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [transactionId, setTransactionId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const registration = localStorage.getItem("auctionRegistration");
    const savedRegistrationId = localStorage.getItem("registrationId");

    if (!registration || !savedRegistrationId) {
      router.push("/register");
      return;
    }

    const data = JSON.parse(registration);

    setRegistrationId(savedRegistrationId);
    setUserName(data.name || "");
    setEmail(data.email || "");
  }, [router]);

  const handleSubmitPayment = async () => {
    if (!transactionId.trim()) {
      alert("Please enter UTR / Transaction ID.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase
        .from("players")
        .update({
          payment_method: paymentMethod,
          transaction_id: transactionId.trim(),
          payment_status: "Pending",
          auction_status: "Not Eligible",
        })
        .eq("registration_id", registrationId);

      if (error) {
        console.error(error);
        alert("Payment details could not be saved: " + error.message);
        return;
      }

      localStorage.setItem("paymentStatus", "Pending");

      alert(
        "Payment details submitted successfully! Your payment is pending admin verification."
      );

      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900">
            🏏 Cricket Auction
          </h1>

          <p className="text-slate-600 mt-2">
            Complete Your Registration Payment
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">

          {/* Registration Details */}
          <div className="bg-slate-50 rounded-xl p-5 mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Registration Details
            </h2>

            <div className="space-y-2 text-slate-700">
              <p>
                <strong>Registration ID:</strong> {registrationId}
              </p>

              <p>
                <strong>Name:</strong> {userName}
              </p>

              <p>
                <strong>Email:</strong> {email}
              </p>
            </div>
          </div>

          {/* Amount */}
          <div className="text-center mb-6">
            <p className="text-slate-600">
              Registration Fee
            </p>

            <p className="text-5xl font-bold text-blue-600 mt-2">
              ₹50
            </p>
          </div>

          {/* QR Code */}
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              Scan & Pay ₹50
            </h2>

            <div className="flex justify-center">
              <div className="border-4 border-slate-200 rounded-xl p-3 bg-white">
                
                <img
                  src="/payment-qr.jpeg"
                  alt="Payment QR Code"
                  className="w-64 h-64 object-contain"
                />

              </div>
            </div>

            <p className="text-sm text-slate-500 mt-4">
              Scan the QR code using your UPI app and pay ₹50.
            </p>
          </div>

          {/* Payment Method */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Payment Method
            </label>

            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="UPI">UPI</option>
              <option value="Google Pay">Google Pay</option>
              <option value="PhonePe">PhonePe</option>
              <option value="Paytm">Paytm</option>
              <option value="Other UPI">Other UPI</option>
            </select>
          </div>

          {/* Transaction ID */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              UTR / Transaction ID
            </label>

            <input
              type="text"
              placeholder="Enter your UTR / Transaction ID"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="w-full bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <p className="text-xs text-slate-500 mt-2">
              Enter the transaction ID shown after completing your payment.
            </p>
          </div>

          {/* Status Information */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <p className="font-semibold text-yellow-800">
              ⏳ Payment Verification
            </p>

            <p className="text-sm text-yellow-700 mt-1">
              Your payment will remain{" "}
              <strong>Pending</strong> until an administrator verifies your transaction.
            </p>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmitPayment}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 rounded-lg transition"
          >
            {loading
              ? "Submitting Payment Details..."
              : "Submit Payment Details"}
          </button>

          {/* Back */}
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => router.push("/register")}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Registration
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}