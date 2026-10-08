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
  const [experience, setExperience] = useState("");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !name ||
      !email ||
      !mobile ||
      !dob ||
      !city ||
      !role ||
      !experience ||
      !address
    ) {
      alert("Please fill all the fields.");
      return;
    }

    try {
      setLoading(true);

      const registrationId =
        "CA-" + Math.floor(100000 + Math.random() * 900000);

      const { error } = await supabase.from("players").insert([
        {
          registration_id: registrationId,
          name: name,
          email: email,
          mobile: mobile,
          dob: dob,
          city: city,
          role: role,
          experience: experience,
          address: address,
          registration_fee: 50,
          payment_method: "UPI",
          payment_status: "Pending",
          auction_status: "Not Eligible",
        },
      ]);

      if (error) {
        console.error(error);
        alert("Registration failed: " + error.message);
        return;
      }

      // Save registration ID locally for payment page
      localStorage.setItem("registrationId", registrationId);

      // Also save registration details locally for temporary use
      localStorage.setItem(
        "auctionRegistration",
        JSON.stringify({
          registrationId,
          name,
          email,
          mobile,
          dob,
          city,
          role,
          experience,
          address,
        })
      );

      alert("Registration successful!");

      router.push("/payment");
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900">
            🏏 Cricket Auction
          </h1>

          <p className="text-slate-600 mt-2">
            Auction Registration
          </p>
        </div>

        {/* Registration Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">

          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Player Information
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

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

            {/* Mobile */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Mobile Number
              </label>

              <input
                type="tel"
                placeholder="Enter your mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Date of Birth
              </label>

              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                City
              </label>

              <input
                type="text"
                placeholder="Enter your city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Cricket Role
              </label>

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select your role</option>
                <option value="Batsman">Batsman</option>
                <option value="Bowler">Bowler</option>
                <option value="All-Rounder">All-Rounder</option>
                <option value="Wicket Keeper">Wicket Keeper</option>
              </select>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Playing Experience
              </label>

              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select your experience</option>
                <option value="Beginner">Beginner</option>
                <option value="1-3 Years">1-3 Years</option>
                <option value="3-5 Years">3-5 Years</option>
                <option value="5+ Years">5+ Years</option>
              </select>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Address
              </label>

              <textarea
                placeholder="Enter your full address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={4}
                className="w-full bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 rounded-lg transition"
            >
              {loading
                ? "Saving Registration..."
                : "Continue to Payment →"}
            </button>

          </form>

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