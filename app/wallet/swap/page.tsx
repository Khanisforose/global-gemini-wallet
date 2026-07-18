"use client"; import { useState } from "react"; import Link from "next/link";

const ASSETS = [
  { s: "USD", t: "Fiat", c: "#fff" },
  { s: "USDT", t: "Crypto", c: "#26a17b" },
  { s: "BTC", t: "Crypto", c: "#f7931a" },
  { s: "ETH", t: "Crypto", c: "#627eea" },
  { s: "SOL", t: "Crypto", c: "#9945ff" },
];

export default function SwapPage() {
  const [from, setFrom] = useState("USD"); const [to, setTo] = useState("USDT"); const [amount, setA] = useState("");
  const [loading, setL] = useState(false); const [result, setR] = useState<any>(null); const [err, setErr] = useState("");

  const swap = async () => {
    if (from === to) { setErr("Select different currencies"); return; }
    if (!amount || parseFloat(amount) <= 0) { setErr("Enter valid amount"); return; }
    setL(true); setErr(""); setR(null);
    try {
      const res = await fetch("/api/swap", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ from, to, amount: parseFloat(amount) }) });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      setR(d);
    } catch (e: any) { setErr(e.message); }
    finally { setL(false); }
  };

  const IP = { width: "100%", padding: "12px 14px", background: "#151525", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", color: "#fff", fontSize: "14px", outline: "none", boxSizing: "border-box" as const };

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0f", padding: "24px 5%" }}>
      <div style={{ maxWidth: "480px", margin: "0 auto" }}>
        <Link href="/dashboard" style={{ color: "#6b7280", fontSize: "13px", textDecoration: "none" }}>← Dashboard</Link>
        <h1 className="font-display" style={{ fontSize: "24px", fontWeight: "700", margin: "16px 0 24px" }}>🔄 Swap Assets</h1>

        {err && <div className="badge badge-red" style={{ marginBottom: "16px", padding: "12px", borderRadius: "8px", display: "block" }}>{err}</div>}
        {result && (
          <div className="card" style={{ padding: "24px", marginBottom: "20px", textAlign: "center", background: "rgba(34,197,94,0.06)", borderColor: "rgba(34,197,94,0.15)" }}>
            <div style={{ fontSize: "36px", marginBottom: "8px" }}>✅</div>
            <p style={{ fontSize: "18px", fontWeight: "700" }}>Swapped {result.amount} {result.from}</p>
            <p style={{ fontSize: "24px", fontWeight: "700", color: "#22c55e", margin: "8px 0" }}>→ {result.received} {result.to}</p>
            <button onClick={() => setR(null)} className="btn btn-primary btn-sm" style={{ marginTop: "12px" }}>Swap Again</button>
          </div>
        )}

        <div className="card" style={{ padding: "24px" }}>
          <div style={{ marginBottom: "16px" }}>
            <label className="text-xs text-muted" style={{ display: "block", marginBottom: "6px" }}>From</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <select value={from} onChange={e => setFrom(e.target.value)} className="input" style={{ width: "100px" }}>
                {ASSETS.map(a => <option key={a.s} value={a.s}>{a.s}</option>)}
              </select>
              <input type="number" step="0.01" min="0.01" value={amount} onChange={e => setA(e.target.value)} placeholder="0.00" className="input" style={{ flex: 1 }} />
            </div>
          </div>

          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <button onClick={() => { setFrom(to); setTo(from); setR(null) }}
              style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)", color: "#d4af37", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
              ⇅
            </button>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label className="text-xs text-muted" style={{ display: "block", marginBottom: "6px" }}>To</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <select value={to} onChange={e => setTo(e.target.value)} className="input" style={{ width: "100px" }}>
                {ASSETS.map(a => <option key={a.s} value={a.s}>{a.s}</option>)}
              </select>
              <div className="input" style={{ flex: 1, display: "flex", alignItems: "center", color: "#6b7280", fontSize: "13px" }}>
                {amount ? `≈ ${(from === "USD" && to !== "USD" ? parseFloat(amount) / 1 : parseFloat(amount)).toFixed(4)} ${to}` : "Estimated"}
              </div>
            </div>
          </div>

          <button onClick={swap} disabled={loading} className="btn btn-primary" style={{ width: "100%" }}>
            {loading ? "Swapping..." : "🔄 Swap Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
