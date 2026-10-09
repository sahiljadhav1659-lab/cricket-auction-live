"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase/client";

export default function RegisterPage() {
const router = useRouter();

const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [mobile, setMobile] = useState("");
const [dob, setDob] = useState("");
const [city, setCity] = useState("");
const [role, setRole] = useState("");
const [address, setAddress] = useState("");
const [loading, setLoading] = useState(false);

const inputClass =
"w-full bg-white text-slate-900 placeholder border border-slate-300 rounded-lg px-4 py-3 outline-none focus focus";

async function handleSubmit(e: FormEvent<HTMLFormElement>) {
e.preventDefault();

if (
  !name.trim() ||
  !email.trim() ||
  !mobile.trim() ||
  !dob ||
  !city.trim() ||
  !role ||
  !address.trim()
) {
  alert("Please fill in all required fields.");
  return;
}

if (!/^\d{10}$/.test(mobile.trim())) {
  alert("Please enter a valid 10-digit mobile number.");
  return;
}

setLoading(true);

try {
  const registrationId =
    "CA-" + Math.floor(100000 + Math.random() * 900000);

  const { error } = await supabase.from("players").insert({
    registration_id: registrationId,
    name: name.trim(),
    email: email.trim(),
    mobile: mobile.trim(),
    dob,
    city: city.trim(),
    role,
    address: address.trim(),
    experience: "",
    auction_status: "Confirmed",
  });

  if (error) {
    console.error("Registration error:", error);
    alert("Registration failed: " + error.message);
    return;
  }

  localStorage.setItem("registrationId", registrationId);

  localStorage.setItem(
    "auctionRegistration",
    JSON.stringify({
      registrationId,
      name: name.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
      dob,
      city: city.trim(),
      role,
      address: address.trim(),
    })
  );

  alert(
    `Registration successful!\nYour Registration ID is ${registrationId}`
  );

  router.push("/dashboard");
} catch (error: unknown) {
  console.error("Registration error:", error);

  const message =
    error instanceof Error ? error.message : String(error);

  alert("Something went wrong: " + message);
} finally {
  setLoading(false);
}

}

return (
<main className="min-h-screen bg-slate-100 py-10 px-4">
<div className="max-w-3xl mx-auto">
<div className="text-center mb-8">
<h1 className="text-4xl font-bold text-slate-900">
Cricket Auction
</h1>

      <p className="text-slate-600 mt-2">
        Player Registration
      </p>
    </div>

    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">
        Player Information
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Full Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Email Address
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Mobile Number
          </label>

          <input
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className={inputClass}
            placeholder="Enter your 10-digit mobile number"
            maxLength={10}
            inputMode="numeric"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Date of Birth
          </label>

          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            max="9999-12-31"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            City
          </label>

          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={inputClass}
            placeholder="Enter your city"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Cricket Role
          </label>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={inputClass}
            required
          >
            <option value="">Select your role</option>
            <option value="Batsman">Batsman</option>
            <option value="Bowler">Bowler</option>
            <option value="All-Rounder">All-Rounder</option>
            <option value="Wicket Keeper">Wicket Keeper</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Address
          </label>

          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className={`${inputClass} resize-none`}
            placeholder="Enter your full address"
            rows={4}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 rounded-lg transition"
        >
          {loading ? "Registering Player..." : "Register Now"}
        </button>
      </form>

      <div className="text-center mt-6">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Back to Home
        </button>
      </div>
    </div>
  </div>
</main>

);
}