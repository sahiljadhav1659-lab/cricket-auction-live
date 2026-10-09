
"use client";

import { useEffect, useMemo, useState } from "react";
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
  address: string;
  photo_url: string | null;
  auction_status: string;
  created_at: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [player, setPlayer] = useState<Player | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");

  useEffect(() => {
    loadDashboard();
    // Load dashboard when the page opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const registrationId = localStorage.getItem("registrationId");

      if (!registrationId) {
        router.push("/register");
        return;
      }

      const [myResult, allResult] = await Promise.all([
        supabase
          .from("players")
          .select("*")
          .eq("registration_id", registrationId)
          .single(),

        supabase
          .from("players")
          .select(
            "id, registration_id, name, email, mobile, dob, city, role, address, photo_url, auction_status, created_at"
          )
          .order("created_at", { ascending: false }),
      ]);

      if (myResult.error) {
        console.error("My player error:", myResult.error);
        alert("Could not load your registration. Please register again.");
        return;
      }

      if (allResult.error) {
        console.error("Players gallery error:", allResult.error);
        alert("Could not load the player gallery. Check Supabase permissions.");
        return;
      }

      setPlayer(myResult.data as Player);
      setPlayers((allResult.data || []) as Player[]);
    } catch (error) {
      console.error(error);
      alert("Something went wrong while loading the dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const refreshDashboard = async () => {
    setRefreshing(true);
    await loadDashboard();
    setRefreshing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("userLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("registrationId");
    localStorage.removeItem("auctionRegistration");
    router.push("/login");
  };

  const downloadMyExcel = () => {
    if (!player) {
      alert("Player information is not available.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet([
      {
        "Registration ID": player.registration_id,
        "Full Name": player.name,
        Email: player.email,
        Mobile: player.mobile,
        "Date of Birth": player.dob,
        City: player.city,
        "Cricket Role": player.role,
        Address: player.address,
        "Player Photo URL": player.photo_url || "No photo uploaded",
        "Auction Status": player.auction_status,
        "Registration Date": player.created_at,
      },
    ]);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "My Registration");

    XLSX.writeFile(
      workbook,
      `${player.registration_id}_Registration.xlsx`
    );
  };

  const filteredPlayers = useMemo(() => {
    const term = search.trim().toLowerCase();

    return players.filter((p) => {
      const matchesSearch =
        !term ||
        p.name?.toLowerCase().includes(term) ||
        p.city?.toLowerCase().includes(term) ||
        p.registration_id?.toLowerCase().includes(term);

      const matchesRole =
        selectedRole === "All" || p.role === selectedRole;

      return matchesSearch && matchesRole;
    });
  }, [players, search, selectedRole]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-6xl mb-4">🏏</div>
          <p className="text-slate-300 text-lg">
            Loading Cricket Auction...
          </p>
        </div>
      </main>
    );
  }

  if (!player) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-slate-900">
            Registration Not Found
          </h2>
          <p className="text-slate-600 mt-3">
            We could not find your player details.
          </p>
          <button
            onClick={() => router.push("/register")}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl"
          >
            Register Now
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-3xl shadow-lg">
              🏏
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black tracking-wide">
                CRICKET AUCTION
              </h1>
              <p className="text-xs text-slate-400">
                Player Community
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-300 hover:bg-red-500/20"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-5 py-8 sm:py-12">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-blue-900 via-slate-900 to-orange-950 p-7 sm:p-12 mb-8">
          <div className="absolute -right-10 -top-12 text-[170px] opacity-10 select-none">
            🏏
          </div>

          <div className="relative z-10 max-w-3xl">
            <p className="inline-flex rounded-full border border-orange-300/30 bg-orange-400/10 px-4 py-2 text-sm font-semibold text-orange-200">
              🏆 PLAYER DASHBOARD
            </p>

            <h2 className="mt-5 text-3xl sm:text-5xl font-black leading-tight">
              Welcome back,{" "}
              <span className="text-orange-400">{player.name}!</span>
            </h2>

            <p className="mt-4 max-w-xl text-slate-300 leading-7">
              Meet the players, explore their cricket roles and discover
              your Cricket Auction community.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#player-gallery"
                className="rounded-xl bg-orange-500 px-5 py-3 font-bold text-white hover:bg-orange-600 transition"
              >
                Explore Players ↓
              </a>

              <button
                onClick={downloadMyExcel}
                className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 font-bold hover:bg-white/20 transition"
              >
                📥 My Registration Excel
              </button>
            </div>
          </div>
        </section>

        {/* Personal Registration Card */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-12">
          <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-slate-900 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              <div className="w-36 h-36 shrink-0 overflow-hidden rounded-3xl border-2 border-orange-400/60 bg-slate-800 shadow-xl">
                {player.photo_url ? (
                  <img
                    src={player.photo_url}
                    alt={`${player.name} profile`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl font-black text-orange-400">
                    {player.name?.charAt(0)?.toUpperCase() || "P"}
                  </div>
                )}
              </div>

              <div className="flex-1 text-center sm:text-left">
                <p className="text-sm uppercase tracking-[0.2em] text-orange-400 font-bold">
                  Your Player Profile
                </p>

                <h3 className="mt-2 text-3xl font-black">
                  {player.name}
                </h3>

                <p className="mt-2 text-slate-400">
                  📍 {player.city}
                </p>

                <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2">
                  <span className="rounded-full bg-blue-500/15 px-4 py-2 text-sm font-semibold text-blue-300">
                    🏏 {player.role}
                  </span>

                  <span className="rounded-full bg-green-500/15 px-4 py-2 text-sm font-semibold text-green-300">
                    ✓ {player.auction_status || "Confirmed"}
                  </span>
                </div>

                <p className="mt-4 text-sm text-slate-400">
                  Registration ID:{" "}
                  <span className="font-bold text-white">
                    {player.registration_id}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-orange-400/20 bg-gradient-to-br from-orange-500 to-orange-700 p-7 flex flex-col justify-between">
            <div>
              <p className="text-orange-100 text-sm font-semibold">
                REGISTERED PLAYERS
              </p>
              <p className="mt-3 text-6xl font-black">
                {players.length}
              </p>
              <p className="mt-3 text-orange-100">
                Players in the auction community
              </p>
            </div>

            <button
              onClick={refreshDashboard}
              disabled={refreshing}
              className="mt-6 rounded-xl bg-white/15 border border-white/20 px-4 py-3 text-left font-bold hover:bg-white/25 disabled:opacity-50"
            >
              {refreshing ? "Refreshing..." : "↻ Refresh Player Gallery"}
            </button>
          </div>
        </section>

        {/* Player Gallery */}
        <section id="player-gallery" className="scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-7">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-400">
                THE AUCTION COMMUNITY
              </p>
              <h2 className="mt-2 text-3xl sm:text-4xl font-black">
                Meet the Players
              </h2>
              <p className="mt-3 text-slate-400">
                Player profiles, photos and cricket roles — all in one place.
              </p>
            </div>

            <div className="rounded-xl bg-slate-900 border border-white/10 px-4 py-3 text-sm text-slate-300">
              Showing{" "}
              <span className="font-bold text-orange-400">
                {filteredPlayers.length}
              </span>{" "}
              of {players.length} players
            </div>
          </div>

          {/* Search and filter */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-3 mb-8">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔎 Search by player name, city or registration ID..."
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-5 py-4 text-white placeholder:text-slate-500 outline-none focus:border-orange-400"
            />

            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="rounded-2xl border border-white/10 bg-slate-900 px-5 py-4 text-white outline-none focus:border-orange-400"
            >
              <option value="All">All Cricket Roles</option>
              <option value="Batsman">Batsman</option>
              <option value="Bowler">Bowler</option>
              <option value="All-Rounder">All-Rounder</option>
              <option value="Wicket Keeper">Wicket Keeper</option>
            </select>
          </div>

          {filteredPlayers.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-slate-900 px-6 py-16 text-center">
              <div className="text-6xl">🏏</div>
              <h3 className="mt-5 text-2xl font-bold">
                No Players Found
              </h3>
              <p className="mt-2 text-slate-400">
                Try another name, city or cricket role.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPlayers.map((p, index) => (
                <article
                  key={p.id}
                  className="group overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-lg transition duration-300 hover:-translate-y-2 hover:border-orange-400/60 hover:shadow-orange-950/40"
                >
                  {/* Player portrait */}
                  <div className="relative h-64 overflow-hidden bg-gradient-to-br from-slate-800 via-slate-700 to-orange-950">
                    {p.photo_url ? (
                      <img
                        src={p.photo_url}
                        alt={`${p.name} player photo`}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <div className="flex h-32 w-32 items-center justify-center rounded-full border border-white/20 bg-white/10 text-6xl font-black text-orange-300">
                          {p.name?.charAt(0)?.toUpperCase() || "P"}
                        </div>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/10 pointer-events-none" />

                    <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-slate-950/70 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
                      PLAYER #{index + 1}
                    </span>

                    <span className="absolute right-4 top-4 rounded-full bg-orange-500 px-3 py-1.5 text-xs font-bold text-white shadow">
                      {p.role}
                    </span>

                    <div className="absolute bottom-4 left-5 right-5">
                      <p className="text-xs font-semibold uppercase tracking-widest text-orange-300">
                        Registered Player
                      </p>
                      <h3 className="mt-1 text-2xl font-black text-white break-words">
                        {p.name}
                      </h3>
                    </div>
                  </div>

                  {/* Player information */}
                  <div className="p-5">
                    <div className="flex items-center gap-3 text-sm text-slate-300">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5">
                        📍
                      </span>
                      <div>
                        <p className="text-xs text-slate-500">City</p>
                        <p className="font-semibold">{p.city || "Not provided"}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-3 text-sm text-slate-300">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5">
                        🆔
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs text-slate-500">
                          Registration ID
                        </p>
                        <p className="font-semibold break-all">
                          {p.registration_id}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 border-t border-white/10 pt-4 flex items-center justify-between gap-2">
                      <span className="text-xs text-slate-500">
                        Auction Status
                      </span>
                      <span className="rounded-full bg-green-500/10 px-3 py-1.5 text-xs font-bold text-green-300">
                        ✓ {p.auction_status || "Confirmed"}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-16 border-t border-white/10 py-7 text-center text-sm text-slate-500">
          🏏 Cricket Auction Player Community · Play with passion.
        </footer>
      </div>
    </main>
  );
}