"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function KYCPage() {
  const r = useRouter();
  const [status, setS] = useState("UNVERIFIED");
  const [fn, setFn] = useState("");
  const [dt, setDt] = useState("PASSPORT");
  const [dn, setDn] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [load, setL] = useState(false);

  useEffect(() => {
    fetch("/api/kyc/status").then(r => r.json()).then(d => {
      setS(d.kycStatus || "UNVERIFIED");
      if (d.kycFullName) setFn(d.kycFullName);
    }).catch(() => r.push("/"));
  }, [r]);

  if (status === "VERIFIED") return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass p-8 text-center max-w-sm"><div className="text-5xl mb-4">✅</div><h2 className="text-xl font-bold mb-2">KYC Verified</h2><p className="text-gray-400 text-sm mb-4">You can deposit and withdraw.</p><Link href="/dashboard" className="btn-primary">Dashboard</Link></div>
    </div>
  );

  if (status === "PENDING") return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass p-8 text-center max-w-sm"><div className="text-5xl mb-4">⏳</div><h2 className="text-xl font-bold mb-2">Under Review</h2><p className="text-gray-400 text-sm mb-4">Documents being verified.</p><Link href="/dashboard" className="btn-primary">Dashboard</Link></div>
    </div>
  );

  const submit = async (e: any) => {
    e.preventDefault();
    if (!file) { setErr("Upload a document image"); return; }
    setL(true); setErr(""); setMsg("");
    const fd = new FormData();
    fd.append("fullName", fn);
    fd.append("documentType", dt);
    fd.append("documentNumber", dn);
    fd.append("documentImage", file);
    try {
      const res = await fetch("/api/kyc/submit", { method: "POST", body: fd });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      setMsg("Submitted! Awaiting verification.");
      setS("PENDING");
    } catch (e: any) { setErr(e.message); }
    finally { setL(false); }
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 bg-[var(--bg-primary)]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center">
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white">← Dashboard</Link>
          <span className="ml-auto font-serif font-semibold">Global Gemini <span className="gold-text">Wallet</span></span>
        </div>
      </header>
      <main className="max-w-lg mx-auto px-6 py-8">
        <h1 className="text-2xl font-serif font-bold mb-6">📋 KYC Verification</h1>
        {msg && <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm p-3 rounded-lg mb-4">{msg}</div>}
        {err && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg mb-4">{err}</div>}
        <form onSubmit={submit} className="glass p-6 space-y-4">
          <div><label className="text-xs text-gray-400 block mb-1">Full Name</label><input type="text" value={fn} onChange={e => setFn(e.target.value)} className="input-luxe" required /></div>
          <div><label className="text-xs text-gray-400 block mb-1">Document Type</label><select value={dt} onChange={e => setDt(e.target.value)} className="input-luxe"><option value="PASSPORT">Passport</option><option value="DRIVERS_LICENSE">Driver's License</option><option value="AADHAR">Aadhaar</option><option value="PAN">PAN Card</option><option value="NATIONAL_ID">National ID</option></select></div>
          <div><label className="text-xs text-gray-400 block mb-1">Document Number</label><input type="text" value={dn} onChange={e => setDn(e.target.value)} className="input-luxe" required /></div>
          <div><label className="text-xs text-gray-400 block mb-1">Upload Document</label><input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="input-luxe" required /></div>
          <button type="submit" disabled={load} className="btn-primary w-full">{load ? "..." : "Submit for Verification"}</button>
        </form>
      </main>
    </div>
  );
}
