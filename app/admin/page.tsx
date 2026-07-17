"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminPage() {
  const r = useRouter();
  const [u, setU] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [email, setE] = useState("");
  const [curr, setC] = useState("USD");
  const [amt, setA] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.role !== "ADMIN") { r.push("/"); return; }
      setU(d);
      fetch("/api/admin/users").then(r => r.json()).then(d => setUsers(d.users || [])).catch(() => {});
    }).catch(() => r.push("/"));
  }, [r]);

  const fund = async (e: any) => {
    e.preventDefault();
    setMsg(""); setErr("");
    try {
      const res = await fetch("/api/admin/fund", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, currency: curr, amount: parseFloat(amt) }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      setMsg(`✅ Funded ${email} with ${amt} ${curr}`);
      setA("");
    } catch (e: any) { setErr(e.message); }
  };

  if (!u) return null;

  const CURRENCIES = ["USD", "EUR", "GBP", "JPY", "CHF", "CAD", "AUD", "CNY", "INR", "BRL", "MXN", "SGD", "NZD", "KRW", "SEK", "TRY", "AED"];

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 bg-[var(--bg-primary)]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-serif font-semibold">Global Gemini <span className="gold-text">Wallet</span> <span className="text-xs bg-gold-500/10 text-gold-400 px-2 py-0.5 rounded-full">Admin</span></span>
          <button onClick={async () => { await fetch("/api/auth/signout", { method: "POST" }); r.push("/"); }} className="text-sm text-gray-400 hover:text-white">Sign Out</button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-serif font-bold gold-text mb-6">⚡ Admin Dashboard</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <Link href="/admin" className="btn-primary text-sm">💫 Fund Users</Link>
          <Link href="/admin/kyc" className="btn-secondary text-sm">📋 KYC Queue</Link>
          <Link href="/admin/deposits" className="btn-secondary text-sm">📥 Deposits</Link>
          <Link href="/admin/withdrawals" className="btn-secondary text-sm">📤 Withdrawals</Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="glass p-4 text-center"><div className="text-2xl font-bold text-blue-400">{users.length}</div><div className="text-xs text-gray-500">Users</div></div>
          <div className="glass p-4 text-center"><div className="text-2xl font-bold text-yellow-400">{users.filter((u: any) => u.kycStatus === "PENDING").length}</div><div className="text-xs text-gray-500">KYC Pending</div></div>
          <div className="glass p-4 text-center"><div className="text-2xl font-bold text-green-400">{users.filter((u: any) => u.kycStatus === "VERIFIED").length}</div><div className="text-xs text-gray-500">KYC Verified</div></div>
          <div className="glass p-4 text-center"><div className="text-2xl font-bold text-purple-400">{users.filter((u: any) => u.role === "USER").length}</div><div className="text-xs text-gray-500">Active Users</div></div>
        </div>

        {/* Fund Form */}
        <div className="glass p-6 max-w-lg mb-6">
          <h2 className="text-lg font-serif font-semibold mb-4">💫 Fund a User</h2>
          {msg && <div className="bg-green-500/10 text-green-400 text-sm p-3 rounded-lg mb-3">{msg}</div>}
          {err && <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-lg mb-3">{err}</div>}
          <form onSubmit={fund} className="space-y-3">
            <select value={email} onChange={e => setE(e.target.value)} className="input-luxe" required>
              <option value="">Select user...</option>
              {users.filter((u: any) => u.role !== "ADMIN").map((u: any) => (
                <option key={u.id} value={u.email}>{u.name} ({u.email}) — KYC: {u.kycStatus}</option>
              ))}
            </select>
            <div className="flex gap-3">
              <select value={curr} onChange={e => setC(e.target.value)} className="input-luxe w-28">
                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input type="number" step="0.01" min="0.01" value={amt} onChange={e => setA(e.target.value)} className="input-luxe flex-1" placeholder="Enter any amount..." required />
            </div>
            <button type="submit" className="btn-primary w-full">💫 Fund Now</button>
          </form>
        </div>

        {/* Users List */}
        <div className="glass p-6">
          <h2 className="text-lg font-serif font-semibold mb-4">👥 All Users</h2>
          {users.map((u: any) => (
            <div key={u.id} className="flex justify-between items-center py-2 border-b border-white/5">
              <div>
                <span className="font-medium text-sm">{u.name}</span>
                <span className="text-gray-500 text-xs ml-2">{u.email}</span>
              </div>
              <div className="flex gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${u.kycStatus === "VERIFIED" ? "bg-green-500/20 text-green-400" : u.kycStatus === "PENDING" ? "bg-yellow-500/20 text-yellow-400" : "bg-gray-500/20 text-gray-400"}`}>{u.kycStatus}</span>
                <span className="text-xs text-gray-500">{u.role}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
