"use client";
import { useState } from "react";
import Link from "next/link";

const METHODS = [
  { id: "UPI", label: "UPI", icon: "📱", desc: "Google Pay, PhonePe, Paytm" },
  { id: "BANK_TRANSFER", label: "Bank Transfer", icon: "🏦", desc: "NEFT / IMPS / Direct" },
  { id: "PAYPAL", label: "PayPal", icon: "🅿️", desc: "PayPal wallet" },
  { id: "CRYPTO", label: "Crypto", icon: "₿", desc: "BTC, ETH, USDT, SOL" },
];

export default function DepositPage() {
  const [method, setM] = useState("UPI");
  const [amount, setA] = useState("");
  const [step, setStep] = useState<"form" | "done">("form");
  const [result, setR] = useState<any>(null);
  const [err, setErr] = useState("");

  async function submit(e: any) {
    e.preventDefault();
    setErr("");
    try {
      const res = await fetch("/api/deposits/create", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseFloat(amount), currency: "USD", method }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      setR(d);
      setStep("done");
    } catch (e: any) { setErr(e.message); }
  }

  if (step === "done" && result) return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass p-8 max-w-md text-center">
        <div className="text-4xl mb-4">📥</div>
        <h2 className="text-xl font-bold mb-2">Deposit Request Created</h2>
        <p className="text-sm text-gray-400 mb-4">Send {result.deposit.amount} {result.deposit.currency} using:</p>
        <div className="bg-black/30 rounded-lg p-4 mb-4 text-left text-sm space-y-2">
          {Object.entries(result.instructions).map(([k, v]: any) => (
            <div key={k} className="flex justify-between"><span className="text-gray-400">{k}:</span><span className="text-gold-400 font-mono">{v}</span></div>
          ))}
        </div>
        <div className="bg-yellow-500/10 text-yellow-400 text-sm p-3 rounded-lg mb-4">⏳ Pending admin verification</div>
        <Link href="/dashboard" className="btn-primary text-sm">Back to Dashboard</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 bg-[var(--bg-primary)]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center">
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white">← Dashboard</Link>
          <span className="ml-auto font-serif font-semibold">Global Gemini <span className="gold-text">Wallet</span></span>
        </div>
      </header>
      <main className="max-w-lg mx-auto px-6 py-8">
        <h1 className="text-2xl font-serif font-bold mb-6">📥 Deposit Funds</h1>
        {err && <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-lg mb-4">{err}</div>}
        <form onSubmit={submit} className="glass p-6 space-y-4">
          <div><label className="text-sm text-gray-400 block mb-3">Method</label>
            <div className="grid grid-cols-2 gap-2">
              {METHODS.map(m => (
                <button key={m.id} type="button" onClick={() => setM(m.id)}
                  className={`p-3 rounded-xl border text-left text-sm ${method === m.id ? "border-gold-500/50 bg-gold-500/10" : "border-white/10 bg-white/5"}`}>
                  <div className="text-lg">{m.icon}</div><div className="font-medium">{m.label}</div><div className="text-xs text-gray-500">{m.desc}</div>
                </button>
              ))}
            </div>
          </div>
          <div><label className="text-sm text-gray-400 block mb-1">Amount (USD)</label><input type="number" value={amount} onChange={e => setA(e.target.value)} className="input-luxe" placeholder="0.00" min="1" step="0.01" required /></div>
          <button type="submit" className="btn-primary w-full">Continue to Payment</button>
        </form>
      </main>
    </div>
  );
}
