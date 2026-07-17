"use client";
import { useState } from "react";
import Link from "next/link";

export default function WithdrawPage() {
  const [method, setM] = useState("UPI");
  const [amount, setA] = useState("");
  const [details, setD] = useState<Record<string, string>>({});
  const [step, setStep] = useState<"form" | "done">("form");
  const [err, setErr] = useState("");

  const fields = method === "UPI" ? [{ k: "upiId", lbl: "UPI ID", ph: "example@paytm" }]
    : method === "BANK_ACCOUNT" ? [{ k: "accountName", lbl: "Account Name", ph: "John Doe" }, { k: "accountNumber", lbl: "Account Number", ph: "1234567890" }, { k: "ifsc", lbl: "IFSC Code", ph: "HDFC0001234" }]
    : method === "PAYPAL" ? [{ k: "email", lbl: "PayPal Email", ph: "user@example.com" }]
    : [{ k: "address", lbl: "Wallet Address", ph: "0x... or bc1..." }, { k: "network", lbl: "Network", ph: "ERC20 / SOL" }];

  async function submit(e: any) {
    e.preventDefault();
    setErr("");
    try {
      const res = await fetch("/api/withdrawals/create", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseFloat(amount), currency: "USD", method, accountDetails: details }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      setStep("done");
    } catch (e: any) { setErr(e.message); }
  }

  if (step === "done") return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass p-8 max-w-md text-center">
        <div className="text-4xl mb-4">📤</div>
        <h2 className="text-xl font-bold mb-2">Withdrawal Submitted</h2>
        <p className="text-gray-400 text-sm mb-4">Pending admin approval.</p>
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
        <h1 className="text-2xl font-serif font-bold mb-6">📤 Withdraw Funds</h1>
        {err && <div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-lg mb-4">{err}</div>}
        <form onSubmit={submit} className="glass p-6 space-y-4">
          <div><label className="text-sm text-gray-400 block mb-3">Withdraw To</label>
            <div className="grid grid-cols-2 gap-2">
              {[{ id: "UPI", icon: "📱", label: "UPI" }, { id: "BANK_ACCOUNT", icon: "🏦", label: "Bank" }, { id: "PAYPAL", icon: "🅿️", label: "PayPal" }, { id: "CRYPTO", icon: "₿", label: "Crypto" }].map(m => (
                <button key={m.id} type="button" onClick={() => { setM(m.id); setD({}); }}
                  className={`p-3 rounded-xl border text-sm ${method === m.id ? "border-gold-500/50 bg-gold-500/10" : "border-white/10 bg-white/5"}`}>
                  <div className="text-lg">{m.icon}</div><div>{m.label}</div>
                </button>
              ))}
            </div>
          </div>
          <div><label className="text-sm text-gray-400 block mb-1">Amount (USD)</label><input type="number" value={amount} onChange={e => setA(e.target.value)} className="input-luxe" placeholder="0.00" min="1" step="0.01" required /></div>
          <div className="space-y-2">
            {fields.map(f => (
              <input key={f.k} type="text" value={details[f.k] || ""} onChange={e => setD({ ...details, [f.k]: e.target.value })}
                className="input-luxe" placeholder={f.ph} required />
            ))}
          </div>
          <button type="submit" className="btn-primary w-full">Submit Withdrawal</button>
        </form>
      </main>
    </div>
  );
}
