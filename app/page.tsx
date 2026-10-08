import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-950/95">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            🏏 Cricket Auction
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-5 py-2 rounded-lg border border-slate-600 hover:bg-slate-800 transition"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold transition"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-4xl">

            <div className="inline-block mb-6 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400">
              🏆 Online Cricket Auction Platform
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Build Your Team.
              <span className="text-blue-500"> Win the Auction.</span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-slate-400 max-w-2xl leading-8">
              Register for the cricket auction, complete your player profile,
              and get ready for an exciting cricket auction experience.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-10">

              <Link
                href="/register"
                className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-center font-bold text-lg transition"
              >
                Register for Auction →
              </Link>

              <Link
                href="/login"
                className="px-8 py-4 rounded-xl border border-slate-600 hover:bg-slate-800 text-center font-bold text-lg transition"
              >
                Login
              </Link>

            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold">
              Everything You Need for the Auction
            </h2>

            <p className="text-slate-400 mt-4">
              Simple, fast and organized cricket auction registration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8">
              <div className="text-4xl mb-5">📝</div>

              <h3 className="text-2xl font-bold mb-3">
                Easy Registration
              </h3>

              <p className="text-slate-400 leading-7">
                Enter your personal and cricket information and register
                yourself for the upcoming auction.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8">
              <div className="text-4xl mb-5">💳</div>

              <h3 className="text-2xl font-bold mb-3">
                Secure Payment
              </h3>

              <p className="text-slate-400 leading-7">
                Complete your registration payment and confirm your
                participation in the auction.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8">
              <div className="text-4xl mb-5">🏏</div>

              <h3 className="text-2xl font-bold mb-3">
                Auction Experience
              </h3>

              <p className="text-slate-400 leading-7">
                Get ready to participate in the upcoming cricket auction
                and showcase your skills.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold">
              How It Works
            </h2>

            <p className="text-slate-400 mt-4">
              Get registered in just a few simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

            <div className="text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold">
                1
              </div>

              <h3 className="text-xl font-bold mt-5">
                Create Account
              </h3>

              <p className="text-slate-400 mt-2">
                Login or create your auction account.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold">
                2
              </div>

              <h3 className="text-xl font-bold mt-5">
                Register
              </h3>

              <p className="text-slate-400 mt-2">
                Provide your player information.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold">
                3
              </div>

              <h3 className="text-xl font-bold mt-5">
                Complete Payment
              </h3>

              <p className="text-slate-400 mt-2">
                Complete the registration payment.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold">
                4
              </div>

              <h3 className="text-xl font-bold mt-5">
                Join Auction
              </h3>

              <p className="text-slate-400 mt-2">
                Get ready for the cricket auction.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">

          <h2 className="text-4xl md:text-5xl font-bold">
            Ready for the Auction? 🏏
          </h2>

          <p className="mt-5 text-blue-100 text-lg">
            Register today and get ready for the upcoming cricket auction.
          </p>

          <Link
            href="/register"
            className="inline-block mt-8 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition"
          >
            Register Now →
          </Link>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-8">

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">

            <div>
              <p className="font-bold text-lg">
                🏏 Cricket Auction
              </p>

              <p className="text-slate-500 text-sm mt-1">
                Online Cricket Auction Platform
              </p>
            </div>

            <p className="text-slate-500 text-sm">
              © 2026 Cricket Auction. All rights reserved.
            </p>

          </div>

        </div>
      </footer>

    </main>
  );
}