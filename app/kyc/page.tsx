"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function KYCPage() {
  const [status, setS] = useState("UNVERIFIED");
  const [user, setUser] = useState<any>(null);
  const [fn, setFn] = useState("");
  const [dt, setDt] = useState("PASSPORT");
  const [dn, setDn] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [load, setL] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.id) setUser(d);
      else window.location.href = "/";
    });
    fetch("/api/kyc/status").then(r => r.json()).then(d => {
      if (d.kycStatus) setS(d.kycStatus);
      if (d.kycFullName) setFn(d.kycFullName);
    }).catch(() => {});
  }, []);

  if (!user) return <div className="min-h-screen flex items-center justify-center"><div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"/></div>;

  if (status === "VERIFIED") return (
    <div className="min-h-screen flex items-center justify-center"><div className="glass p-8 text-center max-w-sm" style={{background:"rgba(255,255,255,0.04)",backdropFilter:"blur(24px)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"16px"}}>
      <div className="text-5xl mb-4">✅</div><h2 className="text-xl font-bold mb-2">KYC Verified</h2>
      <p className="text-gray-400 text-sm mb-4">You can deposit and withdraw.</p>
      <Link href="/dashboard" style={{display:"inline-flex",padding:"10px 24px",background:"linear-gradient(135deg,#d4af37,#b8942e)",color:"#000",fontWeight:"600",borderRadius:"10px",textDecoration:"none"}}>Dashboard</Link>
    </div></div>
  );

  if (status === "PENDING") return (
    <div className="min-h-screen flex items-center justify-center"><div className="glass p-8 text-center max-w-sm" style={{background:"rgba(255,255,255,0.04)",backdropFilter:"blur(24px)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"16px"}}>
      <div className="text-5xl mb-4">⏳</div><h2 className="text-xl font-bold mb-2">Under Review</h2>
      <p className="text-gray-400 text-sm mb-4">Documents being verified.</p>
      <Link href="/dashboard" style={{display:"inline-flex",padding:"10px 24px",background:"linear-gradient(135deg,#d4af37,#b8942e)",color:"#000",fontWeight:"600",borderRadius:"10px",textDecoration:"none"}}>Dashboard</Link>
    </div></div>
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
    <div className="min-h-screen" style={{background:"#0a0a0f",color:"#fff",fontFamily:"Inter,sans-serif"}}>
      <div style={{borderBottom:"1px solid rgba(255,255,255,0.08)",padding:"16px 24px",display:"flex",alignItems:"center",maxWidth:"800px",margin:"0 auto"}}>
        <Link href="/dashboard" style={{color:"#9ca3af",fontSize:"14px",textDecoration:"none"}}>← Dashboard</Link>
        <span style={{marginLeft:"auto",fontFamily:"Georgia,serif",fontSize:"18px"}}>Global Gemini <span style={{background:"linear-gradient(135deg,#d4af37,#f0d060)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Wallet</span></span>
      </div>
      <main style={{maxWidth:"500px",margin:"0 auto",padding:"32px 24px"}}>
        <h1 style={{fontSize:"24px",fontWeight:"bold",fontFamily:"Georgia,serif",marginBottom:"24px"}}>📋 KYC Verification</h1>
        {msg && <div style={{background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.2)",color:"#22c55e",fontSize:"13px",padding:"12px",borderRadius:"8px",marginBottom:"16px"}}>{msg}</div>}
        {err && <div style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",color:"#ef4444",fontSize:"13px",padding:"12px",borderRadius:"8px",marginBottom:"16px"}}>{err}</div>}
        <form onSubmit={submit} style={{background:"rgba(255,255,255,0.04)",backdropFilter:"blur(24px)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"16px",padding:"24px",display:"flex",flexDirection:"column",gap:"16px"}}>
          <input type="text" value={fn} onChange={e=>setFn(e.target.value)} placeholder="Full Name" style={{width:"100%",padding:"12px 16px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"10px",color:"#fff",fontSize:"14px",outline:"none"}} required />
          <select value={dt} onChange={e=>setDt(e.target.value)} style={{width:"100%",padding:"12px 16px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"10px",color:"#fff",fontSize:"14px",outline:"none"}}>
            <option value="PASSPORT">Passport</option><option value="DRIVERS_LICENSE">Driver's License</option><option value="AADHAR">Aadhaar</option><option value="PAN">PAN Card</option>
          </select>
          <input type="text" value={dn} onChange={e=>setDn(e.target.value)} placeholder="Document Number" style={{width:"100%",padding:"12px 16px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"10px",color:"#fff",fontSize:"14px",outline:"none"}} required />
          <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0]||null)} style={{width:"100%",padding:"12px 16px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"10px",color:"#fff",fontSize:"14px"}} required />
          <button type="submit" disabled={load} style={{width:"100%",padding:"12px",background:"linear-gradient(135deg,#d4af37,#b8942e)",color:"#000",fontWeight:"600",fontSize:"14px",border:"none",borderRadius:"10px",cursor:"pointer",opacity:load?0.5:1}}>
            {load ? "..." : "Submit for Verification"}
          </button>
        </form>
      </main>
    </div>
  );
}
