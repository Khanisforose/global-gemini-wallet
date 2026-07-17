"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function HomePage() {
  const r = useRouter();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setE] = useState("");
  const [pass, setP] = useState("");
  const [name, setN] = useState("");
  const [err, setErr] = useState("");
  const [load, setL] = useState(false);

  async function handleLogin(e: any) {
    e.preventDefault();
    setErr(""); setL(true);
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      if (d.user.role === "ADMIN") {
        r.push("/admin");
      } else {
        r.push("/dashboard");
      }
      r.refresh();
    } catch (e: any) { setErr(e.message); }
    finally { setL(false); }
  }

  async function handleSignup(e: any) {
    e.preventDefault();
    setErr(""); setL(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password: pass }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      r.push("/dashboard");
      r.refresh();
    } catch (e: any) { setErr(e.message); }
    finally { setL(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-black">G</div>
          <h1 className="text-3xl font-serif font-bold">Global Gemini <span className="gold-text">Wallet</span></h1>
          <p className="text-gray-500 text-sm mt-1">Multi-Currency Wealth Platform</p>
        </div>

        <div className="glass overflow-hidden">
          <div className="flex border-b border-white/10">
            <button onClick={() => { setTab("login"); setErr(""); }}
              className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${tab === "login" ? "bg-gold-500/10 text-gold-400 border-b-2 border-gold-500" : "text-gray-500 hover:text-gray-300"}`}>
              🔐 Sign In
            </button>
            <button onClick={() => { setTab("signup"); setErr(""); }}
              className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${tab === "signup" ? "bg-gold-500/10 text-gold-400 border-b-2 border-gold-500" : "text-gray-500 hover:text-gray-300"}`}>
              ✨ Create Account
            </button>
          </div>

          <div className="p-6">
            {err && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-4">{err}</div>}

            {tab === "login" ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Email</label>
                  <input type="email" value={email} onChange={e => setE(e.target.value)} className="input-luxe" placeholder="you@example.com" required />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Password</label>
                  <input type="password" value={pass} onChange={e => setP(e.target.value)} className="input-luxe" placeholder="••••••••" required />
                </div>
                <button type="submit" disabled={load} className="btn-primary w-full disabled:opacity-50">
                  {load ? "Signing in..." : "Sign In"}
                </button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Admin? Use your admin credentials — you'll be redirected to the admin panel.
                </p>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Name</label>
                  <input type="text" value={name} onChange={e => setN(e.target.value)} className="input-luxe" placeholder="Your name" required />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Email</label>
                  <input type="email" value={email} onChange={e => setE(e.target.value)} className="input-luxe" placeholder="you@example.com" required />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Password</label>
                  <input type="password" value={pass} onChange={e => setP(e.target.value)} className="input-luxe" placeholder="At least 8 chars, 1 uppercase, 1 number" required />
                </div>
                <button type="submit" disabled={load} className="btn-primary w-full disabled:opacity-50">
                  {load ? "Creating account..." : "Create Account"}
                </button>
              </form>
            )}
          </div>
        </div>

        <p className="text-xs text-gray-600 text-center mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
