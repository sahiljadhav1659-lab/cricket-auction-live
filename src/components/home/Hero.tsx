
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#050b14] pt-20">
      
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-20 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />

        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-green-700/10 blur-[100px]" />
      </div>

      {/* Cricket pattern */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-5 py-20 lg:px-8">
        <div className="grid w-full items-center gap-14 lg:grid-cols-2">

          {/* Left */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              PLAYER REGISTRATION OPEN
            </div>

            <h1 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
              YOUR TALENT.
              <br />
              <span className="text-emerald-400">YOUR CHANCE.</span>
              <br />
              YOUR AUCTION.
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-400">
              Register yourself for the upcoming cricket player auction.
              Complete your profile, make the registration payment and become
              eligible for selection.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/register"
                className="rounded-xl bg-emerald-500 px-7 py-4 text-center font-bold text-[#04110b] shadow-xl shadow-emerald-500/20 transition hover:-translate-y-1 hover:bg-emerald-400"
              >
                Register as Player →
              </Link>

              <Link
                href="/auctions"
                className="rounded-xl border border-white/10 bg-white/5 px-7 py-4 text-center font-bold text-white backdrop-blur transition hover:bg-white/10"
              >
                View Auctions
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 grid max-w-lg grid-cols-3 gap-5 border-t border-white/10 pt-7">
              <div>
                <div className="text-2xl font-black text-white">100%</div>
                <div className="mt-1 text-xs text-slate-500">
                  Online Registration
                </div>
              </div>

              <div>
                <div className="text-2xl font-black text-white">Secure</div>
                <div className="mt-1 text-xs text-slate-500">
                  Online Payment
                </div>
              </div>

              <div>
                <div className="text-2xl font-black text-white">Verified</div>
                <div className="mt-1 text-xs text-slate-500">
                  Player Selection
                </div>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="relative hidden lg:block">
            <div className="relative mx-auto aspect-square max-w-[520px]">

              {/* Glow */}
              <div className="absolute inset-10 rounded-full bg-emerald-500/10 blur-3xl" />

              {/* Main Card */}
              <div className="absolute right-0 top-10 w-[390px] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#132235] to-[#07111f] p-7 shadow-2xl shadow-black/50">

                <div className="mb-7 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                      Upcoming Auction
                    </div>

                    <div className="mt-2 text-2xl font-black text-white">
                      Cricket Auction 2026
                    </div>
                  </div>

                  <div className="text-4xl">🏆</div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-xl bg-white/5 p-4">
                    <span className="text-sm text-slate-400">
                      Registration Fee
                    </span>
                    <span className="font-bold text-white">₹500</span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-white/5 p-4">
                    <span className="text-sm text-slate-400">
                      Player Status
                    </span>

                    <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-400">
                      OPEN
                    </span>
                  </div>
                </div>

                <Link
                  href="/register"
                  className="mt-6 block rounded-xl bg-emerald-500 py-4 text-center font-bold text-[#04110b] transition hover:bg-emerald-400"
                >
                  Register Now
                </Link>
              </div>

              {/* Floating Card */}
              <div className="absolute bottom-12 left-0 rounded-2xl border border-white/10 bg-[#0c1828]/95 p-5 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-2xl">
                    ✓
                  </div>

                  <div>
                    <div className="text-sm font-bold text-white">
                      Payment Verified
                    </div>

                    <div className="text-xs text-slate-500">
                      Player is auction eligible
                    </div>
                  </div>
                </div>
              </div>

              {/* Cricket Ball */}
              <div className="absolute -right-4 bottom-5 text-7xl drop-shadow-2xl">
                🏏
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}