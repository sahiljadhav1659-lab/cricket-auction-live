"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
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

    // Temporary storage
    localStorage.setItem(
      "auctionRegistration",
      JSON.stringify({
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

   alert("Registration details saved successfully!");

router.push("/payment");
  };

  return (
    <main className="min-h-screen bg-slate-100 py-10 px-4">

      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900">
            🏏 Cricket Auction
          </h1>

          <p className="text-slate-500 mt-2">
            Auction Registration
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">

          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Player Information
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Full Name */}
            <div>
              <label className="block font-medium text-slate-700 mb-2">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-3"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-medium text-slate-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-3"
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="block font-medium text-slate-700 mb-2">
                Mobile Number
              </label>

              <input
                type="tel"
                placeholder="Enter mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-3"
              />
            </div>

            {/* DOB */}
            <div>
              <label className="block font-medium text-slate-700 mb-2">
                Date of Birth
              </label>

              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-3"
              />
            </div>

            {/* City */}
            <div>
              <label className="block font-medium text-slate-700 mb-2">
                City
              </label>

              <input
                type="text"
                placeholder="Enter your city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-3"
              />
            </div>

            {/* Cricket Role */}
            <div>
              <label className="block font-medium text-slate-700 mb-2">
                Cricket Role
              </label>

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-3"
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
              <label className="block font-medium text-slate-700 mb-2">
                Playing Experience
              </label>

              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-3"
              >
                <option value="">Select experience</option>
                <option value="Beginner">Beginner</option>
                <option value="1-3 Years">1-3 Years</option>
                <option value="3-5 Years">3-5 Years</option>
                <option value="5+ Years">5+ Years</option>
              </select>
            </div>

            {/* Address */}
            <div>
              <label className="block font-medium text-slate-700 mb-2">
                Address
              </label>

              <textarea
                placeholder="Enter your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={4}
                className="w-full border border-slate-300 rounded-lg px-4 py-3"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg"
            >
              Continue to Payment →
            </button>

          </form>

        </div>

      </div>

    </main>
  );
}