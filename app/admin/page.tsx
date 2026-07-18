"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const CURRENCIES = ["USD","EUR","GBP","JPY","CHF","CAD","AUD","CNY","INR","BRL","MXN","USDT","BTC","ETH","SOL"];

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.role !== "ADMIN") { window.location.href = "/"; return; }
      fetch("/api/admin/users").then(r => r.json()).then(d => setUsers(d.users || []));
    });
  }, []);

  async function handleFund(e: any) {
    e.preventDefault(); setMsg(""); setErr("");
    try {
      const r = await fetch("/api/admin/fund", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, currency, amount: parseFloat(amount) }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setMsg("✅ Deposited " + amount + " " + currency + " to " + email);
      setAmount("");
    } catch (e: any) { setErr(e.message); }
  }

  async function deleteUser(id: string) {
    if (!confirm("Delete this user?")) return;
    await fetch("/api/admin/user", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: id }) });
    setUsers(users.filter(x => x.id !== id));
  }

  return (
    <div className="app">
      <div className="top"><div className="top-in">
        <span style={{fontWeight:700,fontSize:18}}>🌍 Global Gemini <span className="gld">Wallet</span><span style={{fontSize:10,background:"rgba(212,175,55,0.12)",color:"#d4af37",padding:"2px 8px",borderRadius:100,marginLeft:8}}>ADMIN</span></span>
        <div style={{display:"flex",gap:16,alignItems:"center"}}>
          <Link href="/admin" className="tab act">💫 Dashboard</Link>
          <Link href="/admin/kyc" className="tab">📋 KYC</Link>
          <Link href="/admin/deposits" className="tab">📥 Deposits</Link>
          <Link href="/admin/withdrawals" className="tab">📤 Withdrawals</Link>
          <button onClick={async()=>{await fetch("/api/auth/signout",{method:"POST"});window.location.href="/"}} className="btn btn-s" style={{padding:"8px 16px"}}>Sign Out</button>
        </div>
      </div></div>

      <div className="main fi">
        <h1 style={{fontSize:26,fontWeight:700,marginBottom:24}}><span className="gld">⚡ Admin Panel</span></h1>
        
        <div className="g4" style={{marginBottom:24}}>
          <div className="st"><div className="st-v" style={{color:"#60a5fa"}}>{users.length}</div><div className="st-l">Users</div></div>
          <div className="st"><div className="st-v" style={{color:"#facc15"}}>{users.filter((x:any)=>x.kycStatus==="PENDING").length}</div><div className="st-l">KYC Pending</div></div>
          <div className="st"><div className="st-v" style={{color:"#22c55e"}}>{users.filter((x:any)=>x.kycStatus==="VERIFIED").length}</div><div className="st-l">Verified</div></div>
          <div className="st"><div className="st-v" style={{color:"#a78bfa"}}>{users.filter((x:any)=>x.role==="USER").length}</div><div className="st-l">Active</div></div>
        </div>

        <div className="g2" style={{gap:24}}>
          <div className="card" style={{padding:24}}>
            <h3 style={{fontSize:16,fontWeight:600,marginBottom:16}}>💫 Deposit to User</h3>
            {msg && <div className="bg">{msg}</div>}
            {err && <div className="br">{err}</div>}
            <form onSubmit={handleFund} style={{display:"flex",flexDirection:"column",gap:12}}>
              <select value={email} onChange={e=>setEmail(e.target.value)} className="inp" required>
                <option value="">Select user...</option>
                {users.filter((x:any)=>x.role!=="ADMIN").map((x:any)=>(
                  <option key={x.id} value={x.email}>{x.name} ({x.email})</option>
                ))}
              </select>
              <div style={{display:"flex",gap:8}}>
                <select value={currency} onChange={e=>setCurrency(e.target.value)} className="inp" style={{width:100}}>
                  {CURRENCIES.map(c=><option key={c} value={c}>{c}</option>)}
                </select>
                <input type="number" step="0.01" min="0.01" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Amount" className="inp" style={{flex:1}} required />
              </div>
              <button type="submit" className="btn btn-p" style={{width:"100%"}}>💫 Deposit</button>
            </form>
          </div>

          <div className="card" style={{padding:24}}>
            <h3 style={{fontSize:16,fontWeight:600,marginBottom:16}}>👥 Users ({users.length})</h3>
            <div style={{maxHeight:500,overflowY:"auto"}}>
              {users.map((x:any)=>(
                <div key={x.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                  <div>
                    <span style={{fontSize:14,fontWeight:500}}>{x.name}</span>
                    <span className="muted" style={{fontSize:12,marginLeft:6}}>{x.email}</span>
                  </div>
                  <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    <span style={{fontSize:11,padding:"3px 8px",borderRadius:100,
                      color: x.kycStatus==="VERIFIED"?"#22c55e":x.kycStatus==="PENDING"?"#facc15":"#ef4444",
                      background: x.kycStatus==="VERIFIED"?"rgba(34,197,94,0.1)":x.kycStatus==="PENDING"?"rgba(250,204,21,0.1)":"rgba(239,68,68,0.1)"
                    }}>{x.kycStatus}</span>
                    {x.role!=="ADMIN" && (
                      <button onClick={()=>deleteUser(x.id)} style={{padding:"4px 10px",background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:6,color:"#ef4444",fontSize:11,cursor:"pointer"}}>Delete</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
