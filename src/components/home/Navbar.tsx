"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#07111f]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 text-2xl shadow-lg shadow-green-500/20">
            🏏
          </div>

          <div>
            <div className="text-lg font-black tracking-wide text-white">
              CRICKET<span className="text-emerald-400">AUCTION</span>
            </div>
            <div className="text-[10px] font-medium tracking-[0.25em] text-slate-400">
              PLAYER REGISTRATION
            </div>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-white transition hover:text-emerald-400"
          >
            Home
          </Link>

          <Link
            href="/auctions"
            className="text-sm font-medium text-slate-300 transition hover:text-emerald-400"
          >
            Auctions
          </Link>

          <a
            href="#how-it-works"
            className="text-sm font-medium text-slate-300 transition hover:text-emerald-400"
          >
            How It Works
          </a>

          <a
            href="#contact"
            className="text-sm font-medium text-slate-300 transition hover:text-emerald-400"
          >
            Contact
          </a>
        </div>

        {/* Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-bold text-[#04110b] shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400"
          >
            Register Now
          </Link>
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg border border-white/10 px-3 py-2 text-white md:hidden"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-[#07111f] px-5 py-5 md:hidden">
          <div className="flex flex-col gap-4">
            <Link href="/" className="text-white">
              Home
            </Link>

            <Link href="/auctions" className="text-slate-300">
              Auctions
            </Link>

            <a href="#how-it-works" className="text-slate-300">
              How It Works
            </a>

            <a href="#contact" className="text-slate-300">
              Contact
            </a>

            <Link
              href="/login"
              className="rounded-lg border border-white/10 px-4 py-3 text-center text-white"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-lg bg-emerald-500 px-4 py-3 text-center font-bold text-[#04110b]"
            >
              Register Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}