"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminKYC() {
  const [users, setU] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/admin/kyc/list").then(r => r.json()).then(d => setU(d.users || [])).catch(() => {});
  }, []);

  async function verify(id: string, action: string) {
    await fetch("/api/admin/kyc/verify", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: id, action }),
    });
    setU(users.filter(u => u.id !== id));
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
        <h1 className="text-2xl font-serif font-bold gold-text mb-6">📋 KYC Verification Queue</h1>
        {users.length === 0 ? (
          <div className="glass p-12 text-center text-gray-500">No pending KYC requests</div>
        ) : (
          <div className="space-y-4">
            {users.map(u => (
              <div key={u.id} className="glass p-4 flex items-start justify-between flex-wrap gap-4">
                <div>
                  <p className="font-medium">{u.kycFullName || u.name}</p>
                  <p className="text-sm text-gray-400">{u.email}</p>
                  <p className="text-xs text-gray-500">Doc: {u.kycDocumentType} • #{u.kycDocumentNumber}</p>
                  <p className="text-xs text-gray-500">Submitted: {new Date(u.kycSubmittedAt).toLocaleString()}</p>
                </div>
                {u.kycDocumentImage && (
                  <img src={u.kycDocumentImage} alt="Document" className="w-28 h-20 object-cover rounded-lg border border-white/10" />
                )}
                <div className="flex gap-2">
                  <button onClick={() => verify(u.id, "VERIFIED")} className="px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg text-sm hover:bg-green-500/30">✅ Approve</button>
                  <button onClick={() => verify(u.id, "REJECTED")} className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-sm hover:bg-red-500/30">❌ Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
