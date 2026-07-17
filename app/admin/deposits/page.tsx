"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminDeposits() {
  const [deps, setD] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/admin/deposits").then(r => r.json()).then(d => setD(d.deposits || [])).catch(() => {});
  }, []);

  async function act(id: string, action: string) {
    await fetch("/api/admin/deposits", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ depositId: id, action }),
    });
    setD(deps.filter(d => d.id !== id));
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 bg-[var(--bg-primary)]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-serif font-semibold">Global Gemini <span className="gold-text">Wallet</span> <span className="text-xs bg-gold-500/10 text-gold-400 px-2 py-0.5 rounded-full">Admin</span></span>
          <Link href="/admin" className="btn-secondary text-sm py-2 px-4">← Admin</Link>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-serif font-bold gold-text mb-6">📥 Deposit Requests</h1>
        {deps.length === 0 ? (
          <div className="glass p-12 text-center text-gray-500">No pending deposits</div>
        ) : (
          <div className="space-y-3">
            {deps.map(d => (
              <div key={d.id} className="glass p-4 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="font-medium">{d.user?.name} ({d.user?.email})</p>
                  <p className="text-lg font-bold gold-text">+{Number(d.amount).toLocaleString()} {d.currency}</p>
                  <p className="text-xs text-gray-500">Method: {d.method} • {new Date(d.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => act(d.id, "APPROVED")} className="px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg text-sm">✅ Approve</button>
                  <button onClick={() => act(d.id, "REJECTED")} className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-sm">❌ Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
