"use client";

import { useState } from "react";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage("You're in! Welcome to BCU.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Connection error. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Nav */}
      <nav className="px-6 py-5 border-b border-slate-800">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="text-xl font-bold tracking-tight">
            <span className="text-blue-500">Blue Collar</span> Up
          </div>
          <div className="text-sm text-slate-400">BCU</div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block px-4 py-1.5 bg-blue-900/50 border border-blue-700 rounded-full text-sm text-blue-300 mb-6">
            For blue collar workers. By blue collar workers.
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Stand Strong.<br />Stand Together.<br /><span className="text-blue-500">Stand UP!</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-xl mx-auto">
            90% of blue collar workers have no one bargaining for them. 
            BCU gives non-union workers the collective power they deserve.
          </p>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={status === "loading"}
              className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors whitespace-nowrap"
            >
              {status === "loading" ? "Joining..." : status === "success" ? "You're In!" : "Join BCU"}
            </button>
          </form>

          {message && (
            <p className={`mt-4 text-sm ${status === "error" ? "text-red-400" : "text-emerald-400"}`}>
              {message}
            </p>
          )}

          <p className="mt-4 text-sm text-slate-500">
            No spam. No fees. Just power in numbers.
          </p>
        </div>
      </section>

      {/* Stats Band */}
      <section className="bg-slate-900 border-y border-slate-800 py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-500">90%</div>
            <div className="text-slate-400 mt-1">of blue collar workers have NO union</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-500">$10K+</div>
            <div className="text-slate-400 mt-1">yearly pay gap vs union counterparts</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-500">0%</div>
            <div className="text-slate-400 mt-1">collective bargaining power — until now</div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">The Problem</h2>
          <p className="text-slate-400 text-center mb-12 max-w-xl mx-auto">
            Big businesses have HR departments, lawyers, and lobbyists. 
            Union workers have contracts, benefits, and bargaining power. 
            What do you have?
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <div className="text-2xl mb-3">😤</div>
              <h3 className="font-semibold text-lg mb-2">The Pay Gap</h3>
              <p className="text-slate-400 text-sm">
                Non-union workers earn $1,138/week on average. Union workers earn $1,337. 
                That's a <span className="text-white font-medium">$10,000+ gap every year</span> — just for not having a contract.
              </p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <div className="text-2xl mb-3">🏥</div>
              <h3 className="font-semibold text-lg mb-2">The Benefits Gap</h3>
              <p className="text-slate-400 text-sm">
                Only 72% of private industry workers have employer-provided retirement plans. 
                Health insurance? Even worse. You're on your own more often than not.
              </p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <div className="text-2xl mb-3">⚖️</div>
              <h3 className="font-semibold text-lg mb-2">The Power Gap</h3>
              <p className="text-slate-400 text-sm">
                When you're by yourself, your employer sets the terms. 
                Rent, groceries, healthcare — costs keep rising. Your bargaining power? Zero.
              </p>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
              <div className="text-2xl mb-3">🔒</div>
              <h3 className="font-semibold text-lg mb-2">The Information Gap</h3>
              <p className="text-slate-400 text-sm">
                Labor laws vary by state and trade. Safety regulations change. 
                Know your rights? Most workers don't — and employers aren't in a rush to help you learn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="bg-slate-900 border-y border-slate-800 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">The Solution</h2>
          <p className="text-slate-400 mb-12 max-w-xl mx-auto">
            BCU is a new kind of workers' organization — no union dues, no union politics. 
            Just collective power, shared resources, and deals that actually move the needle.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="font-bold text-lg mb-2">Collective Purchasing</h3>
              <p className="text-slate-400 text-sm">
                Pool our numbers. Group health insurance, equipment discounts, 
                supplier deals — the kind of rates only big companies get.
              </p>
            </div>
            <div>
              <div className="text-5xl mb-4">📚</div>
              <h3 className="font-bold text-lg mb-2">Shared Knowledge</h3>
              <p className="text-slate-400 text-sm">
                Labor laws, safety standards, wage research, contractor reviews. 
                Real intel from real workers in your trade and state.
              </p>
            </div>
            <div>
              <div className="text-5xl mb-4">💪</div>
              <h3 className="font-bold text-lg mb-2">Bargaining Power</h3>
              <p className="text-slate-400 text-sm">
                Together, we have leverage. Better contracts, better prices, 
                better treatment. Alone, you have none. Together, we have it all.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-900/50 border border-blue-700 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="font-bold text-lg mb-2">Join for Free</h3>
              <p className="text-slate-400 text-sm">
                Sign up with your email. No credit card, no dues, no commitment. 
                Just your name and your trade.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-900/50 border border-blue-700 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="font-bold text-lg mb-2">We Pool Together</h3>
              <p className="text-slate-400 text-sm">
                BCU aggregates workers by trade, location, and needs. 
                The bigger the pool, the better the deals we can negotiate.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-900/50 border border-blue-700 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="font-bold text-lg mb-2">We All Win</h3>
              <p className="text-slate-400 text-sm">
                Lower costs, better benefits, stronger voice. 
                Every member gets more than they put in. That's the deal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-slate-900 border-y border-slate-800 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What You Get</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: "🏥", title: "Health & Wellness Deals", desc: "Group health plans at rates only big companies get. Dental, vision, mental health." },
              { icon: "💰", title: "Equipment & Supply Discounts", desc: "Tools, gear, vehicles, workwear — at member-only prices." },
              { icon: "🏠", title: "Insurance Group Rates", desc: "Life, disability, liability — pooled buying power means lower premiums." },
              { icon: "⚖️", title: "Legal Resources", desc: "Know your rights. Get help understanding labor laws in your state and trade." },
              { icon: "🔧", title: "Contractor Network", desc: "Find trusted tradespeople. Leave honest reviews. Build reputation." },
              { icon: "📢", title: "Workers' Voice", desc: "Collective advocacy. When BCU speaks, employers listen." },
            ].map((benefit, i) => (
              <div key={i} className="flex gap-4 p-5 bg-slate-900/50 border border-slate-800 rounded-xl">
                <span className="text-3xl">{benefit.icon}</span>
                <div>
                  <h3 className="font-semibold mb-1">{benefit.title}</h3>
                  <p className="text-slate-400 text-sm">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Stand UP?</h2>
          <p className="text-slate-400 mb-8">
            Join the movement. First 1,000 members get founding status — 
            locked-in pricing and first access to BCU benefits.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              disabled={status === "loading" || status === "success"}
              className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
            >
              {status === "loading" ? "Joining..." : status === "success" ? "You're In!" : "Get Early Access"}
            </button>
          </form>
          {message && (
            <p className={`mt-4 text-sm ${status === "error" ? "text-red-400" : "text-emerald-400"}`}>
              {message}
            </p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-10 px-6">
        <div className="max-w-5xl mx-auto text-center text-slate-500 text-sm">
          <div className="font-bold text-lg mb-2">
            <span className="text-blue-500">Blue Collar</span> Up
          </div>
          <p>Stand Strong. Stand Together. Stand UP.</p>
          <p className="mt-4">© 2026 Blue Collar Up. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
