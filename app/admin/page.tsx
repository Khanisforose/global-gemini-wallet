"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminPage() {
  const r = typeof window !== "undefined" ? null : null;
  const [users, setUsers] = useState<any[]>([]);
  const [email, setE] = useState("");
  const [curr, setC] = useState("USD");
  const [amt, setA] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch("/api/auth/me").then(r=>r.json()).then(d => {
      if (d.role !== "ADMIN") { window.location.href = "/"; return; }
      fetch("/api/admin/users").then(r=>r.json()).then(d => setUsers(d.users||[]));
    });
  }, []);

  const fund = async (e: any) => {
    e.preventDefault();
    setMsg(""); setErr("");
    try {
      const res = await fetch("/api/admin/fund", {
        method: "POST", headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ email, currency: curr, amount: parseFloat(amt) }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      setMsg(`✅ Credited ${amt} ${curr} to ${email}`);
      setA("");
    } catch (e: any) { setErr(e.message); }
  };

  const CURRENCIES = ["USD","EUR","GBP","JPY","CHF","CAD","AUD","CNY","INR","BRL","MXN","SGD","NZD","KRW","SEK","TRY","AED"];

  return (
    <div style={{minHeight:"100vh",background:"#0a0a0f",color:"#fff",fontFamily:"Inter,sans-serif"}}>
      <div style={{borderBottom:"1px solid rgba(255,255,255,0.08)",padding:"16px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",maxWidth:"1100px",margin:"0 auto"}}>
        <span style={{fontFamily:"Georgia,serif",fontSize:"18px",fontWeight:"600"}}>Global Gemini <span className="gold-text">Wallet</span> <span style={{fontSize:"11px",background:"rgba(212,175,55,0.1)",color:"#d4af37",padding:"2px 8px",borderRadius:"100px",marginLeft:"8px"}}>Admin</span></span>
        <button onClick={async()=>{await fetch("/api/auth/signout",{method:"POST"});window.location.href="/";}} style={{fontSize:"13px",color:"#6b7280",background:"none",border:"none",cursor:"pointer"}}>Sign Out</button>
      </div>

      <div style={{maxWidth:"1100px",margin:"0 auto",padding:"24px"}}>
        <h1 style={{fontSize:"24px",fontWeight:"bold",fontFamily:"Georgia,serif",marginBottom:"16px",background:"linear-gradient(135deg,#d4af37,#f0d060)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>⚡ Admin Dashboard</h1>

        {/* Tabs */}
        <div style={{display:"flex",gap:"8px",marginBottom:"20px",flexWrap:"wrap"}}>
          <Link href="/admin" style={{display:"inline-flex",padding:"10px 20px",background:"linear-gradient(135deg,#d4af37,#b8942e)",color:"#000",fontWeight:"600",fontSize:"13px",borderRadius:"10px",textDecoration:"none"}}>💫 Credit Users</Link>
          <Link href="/admin/kyc" style={{display:"inline-flex",padding:"10px 20px",background:"rgba(255,255,255,0.05)",color:"#e5e7eb",fontWeight:"500",fontSize:"13px",borderRadius:"10px",textDecoration:"none",border:"1px solid rgba(255,255,255,0.1)"}}>📋 KYC</Link>
          <Link href="/admin/deposits" style={{display:"inline-flex",padding:"10px 20px",background:"rgba(255,255,255,0.05)",color:"#e5e7eb",fontWeight:"500",fontSize:"13px",borderRadius:"10px",textDecoration:"none",border:"1px solid rgba(255,255,255,0.1)"}}>📥 Deposits</Link>
          <Link href="/admin/withdrawals" style={{display:"inline-flex",padding:"10px 20px",background:"rgba(255,255,255,0.05)",color:"#e5e7eb",fontWeight:"500",fontSize:"13px",borderRadius:"10px",textDecoration:"none",border:"1px solid rgba(255,255,255,0.1)"}}>📤 Withdrawals</Link>
        </div>

        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:"12px",marginBottom:"20px"}}>
          <div style={{background:"rgba(255,255,255,0.04)",backdropFilter:"blur(24px)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"12px",padding:"16px",textAlign:"center"}}><div style={{fontSize:"24px",fontWeight:"bold",color:"#60a5fa"}}>{users.length}</div><div style={{fontSize:"11px",color:"#6b7280",marginTop:"4px"}}>Users</div></div>
          <div style={{background:"rgba(255,255,255,0.04)",backdropFilter:"blur(24px)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"12px",padding:"16px",textAlign:"center"}}><div style={{fontSize:"24px",fontWeight:"bold",color:"#facc15"}}>{users.filter((u:any)=>u.kycStatus==="PENDING").length}</div><div style={{fontSize:"11px",color:"#6b7280",marginTop:"4px"}}>KYC Pending</div></div>
          <div style={{background:"rgba(255,255,255,0.04)",backdropFilter:"blur(24px)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"12px",padding:"16px",textAlign:"center"}}><div style={{fontSize:"24px",fontWeight:"bold",color:"#22c55e"}}>{users.filter((u:any)=>u.kycStatus==="VERIFIED").length}</div><div style={{fontSize:"11px",color:"#6b7280",marginTop:"4px"}}>Verified</div></div>
        </div>

        {/* Credit Form */}
        <div style={{background:"rgba(255,255,255,0.04)",backdropFilter:"blur(24px)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"16px",padding:"24px",marginBottom:"20px",maxWidth:"500px"}}>
          <h2 style={{fontSize:"18px",fontWeight:"600",fontFamily:"Georgia,serif",marginBottom:"16px"}}>💫 Credit a User</h2>
          {msg && <div style={{background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.2)",color:"#22c55e",fontSize:"13px",padding:"10px",borderRadius:"8px",marginBottom:"12px"}}>{msg}</div>}
          {err && <div style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",color:"#ef4444",fontSize:"13px",padding:"10px",borderRadius:"8px",marginBottom:"12px"}}>{err}</div>}
          <form onSubmit={fund} style={{display:"flex",flexDirection:"column",gap:"12px"}}>
            <select value={email} onChange={e=>setE(e.target.value)} style={{width:"100%",padding:"12px 16px",background:"#1a1a2e",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"10px",color:"#fff",fontSize:"14px",outline:"none"}} required>
              <option value="">Select user...</option>
              {users.filter((u:any)=>u.role!=="ADMIN").map((u:any)=>(
                <option key={u.id} value={u.email}>{u.name} ({u.email}) — KYC: {u.kycStatus}</option>
              ))}
            </select>
            <div style={{display:"flex",gap:"8px"}}>
              <select value={curr} onChange={e=>setC(e.target.value)} style={{width:"120px",padding:"12px 16px",background:"#1a1a2e",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"10px",color:"#fff",fontSize:"14px",outline:"none"}}>
                {CURRENCIES.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
              <input type="number" step="0.01" min="0.01" value={amt} onChange={e=>setA(e.target.value)} placeholder="Enter amount..." style={{flex:1,padding:"12px 16px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"10px",color:"#fff",fontSize:"14px",outline:"none"}} required />
            </div>
            <button type="submit" style={{width:"100%",padding:"12px",background:"linear-gradient(135deg,#d4af37,#b8942e)",color:"#000",fontWeight:"600",fontSize:"14px",border:"none",borderRadius:"10px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}}>💫 Credit Now</button>
          </form>
        </div>

        {/* Users */}
        <div style={{background:"rgba(255,255,255,0.04)",backdropFilter:"blur(24px)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"16px",padding:"20px"}}>
          <h2 style={{fontSize:"16px",fontWeight:"600",fontFamily:"Georgia,serif",marginBottom:"12px"}}>👥 All Users</h2>
          {users.map((u:any)=>(
            <div key={u.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
              <div><span style={{fontSize:"14px",fontWeight:"500"}}>{u.name}</span><span style={{fontSize:"12px",color:"#6b7280",marginLeft:"8px"}}>{u.email}</span></div>
              <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
                <span style={{fontSize:"11px",padding:"2px 8px",borderRadius:"100px",background: u.kycStatus==="VERIFIED"?"rgba(34,197,94,0.15)":u.kycStatus==="PENDING"?"rgba(250,204,21,0.15)":"rgba(107,114,128,0.15)",color: u.kycStatus==="VERIFIED"?"#22c55e":u.kycStatus==="PENDING"?"#facc15":"#6b7280"}}>{u.kycStatus}</span>
                <span style={{fontSize:"11px",color:"#6b7280"}}>{u.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
