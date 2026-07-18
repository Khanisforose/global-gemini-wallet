#!/bin/bash

# ============================================================
# GLOBAL GEMINI WALLET - ULTIMATE FIX
# ============================================================

echo "🚀 Starting ultimate fix..."

# 1. WORLD-CLASS CSS with animated background
cat > app/globals.css << 'CSS'
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Inter', sans-serif; background: #0a0a0f; color: #fff; overflow-x: hidden; }

/* Animated Background */
.bg-glow { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; overflow: hidden; }
.bg-glow .orb { position: absolute; border-radius: 50%; filter: blur(120px); opacity: 0.08; }
.bg-glow .orb1 { width: 600px; height: 600px; background: radial-gradient(circle,#d4af37,transparent); top: -200px; right: -100px; animation: float 12s ease-in-out infinite; }
.bg-glow .orb2 { width: 400px; height: 400px; background: radial-gradient(circle,#d4af37,transparent); bottom: -100px; left: -100px; animation: float 15s ease-in-out infinite reverse; }
.bg-glow .orb3 { width: 300px; height: 300px; background: radial-gradient(circle,#fff,transparent); top: 50%; left: 50%; transform: translate(-50%,-50%); animation: float 18s ease-in-out infinite 3s; opacity: 0.04; }
@keyframes float { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-30px) scale(1.05); } }

/* Grid Pattern Overlay */
.bg-grid { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; background-image: radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 40px 40px; }

.app { min-height: 100vh; display: flex; flex-direction: column; position: relative; z-index: 1; }
.header { position: sticky; top: 0; z-index: 100; backdrop-filter: blur(24px); background: rgba(10,10,15,0.85); border-bottom: 1px solid rgba(255,255,255,0.06); }
.header-inner { display: flex; align-items: center; justify-content: space-between; padding: 14px 5%; width: 100%; }
.main { flex: 1; padding: 28px 5%; width: 100%; }
.card { background: rgba(255,255,255,0.03); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; transition: all 0.3s; }
.card:hover { border-color: rgba(212,175,55,0.15); }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 12px 28px; border-radius: 10px; font-size: 14px; font-weight: 600; border: none; cursor: pointer; transition: all 0.2s ease; text-decoration: none; }
.btn-primary { background: linear-gradient(135deg,#d4af37,#b8942e); color: #0a0a0f; box-shadow: 0 4px 20px rgba(212,175,55,0.15); }
.btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 25px rgba(212,175,55,0.25); }
.btn-secondary { background: rgba(255,255,255,0.05); color: #e5e7eb; border: 1px solid rgba(255,255,255,0.08); }
.btn-secondary:hover { background: rgba(255,255,255,0.08); }
.btn-sm { padding: 8px 18px; font-size: 12px; border-radius: 8px; }
.input { width: 100%; padding: 12px 16px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; color: #fff; font-size: 14px; outline: none; transition: border 0.2s; }
.input:focus { border-color: rgba(212,175,55,0.3); box-shadow: 0 0 0 3px rgba(212,175,55,0.06); }
.input::placeholder { color: #4b5563; }
select.input { cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 36px; }
select.input option { background: #151525; color: #fff; }
.text-gradient { background: linear-gradient(135deg,#d4af37,#f0d060); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.text-muted { color: #6b7280; }
.text-sm { font-size: 13px; }
.text-xs { font-size: 11px; }
.font-display { font-weight: 700; }
.badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 500; }
.badge-green { background: rgba(34,197,94,0.1); color: #22c55e; }
.badge-red { background: rgba(239,68,68,0.1); color: #ef4444; }
.badge-blue { background: rgba(96,165,250,0.1); color: #60a5fa; }
.badge-gold { background: rgba(212,175,55,0.1); color: #d4af37; }
.row { display: flex; align-items: center; gap: 12px; }
.row-between { display: flex; align-items: center; justify-content: space-between; }
.row-wrap { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.tab { padding: 8px 0; background: none; border: none; border-bottom: 2px solid transparent; color: #6b7280; font-size: 14px; cursor: pointer; font-weight: 500; transition: all 0.2s; }
.tab.active { color: #d4af37; border-bottom-color: #d4af37; }
.stat { text-align: center; padding: 20px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; }
.stat-value { font-size: 28px; font-weight: 700; }
.stat-label { font-size: 12px; color: #6b7280; margin-top: 4px; }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
.grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
@keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
.fade-in { animation: fadeIn 0.4s ease-out; }
.loading { width: 22px; height: 22px; border: 2px solid rgba(212,175,55,0.15); border-top-color: #d4af37; border-radius: 50%; animation: spin 0.7s linear infinite; margin: 48px auto; }
@keyframes spin { to { transform: rotate(360deg); } }
@media (max-width:1024px) { .grid-2,.grid-4 { grid-template-columns:1fr; } }
CSS

# 2. Update layout with animated background
cat > app/layout.tsx << 'LAY'
import type { Metadata } from "next"; import "./globals.css";
export const metadata:Metadata={title:"Global Gemini Wallet",description:"Multi-Currency Wealth Platform"};
export default function RootLayout({children}:{children:React.ReactNode}){return(<html lang="en"><body><div className="bg-glow"><div className="orb orb1"/><div className="orb orb2"/><div className="orb orb3"/></div><div className="bg-grid"/>{children}</body></html>)}
LAY

# 3. Fix dashboard - working currency dropdown, deposit/withdraw links
cat > app/dashboard/page.tsx << 'DASH'
"use client"; import { useState, useEffect } from "react"; import Link from "next/link";
export default function Dashboard() {
  const [user, setU] = useState<any>(null); const [tab, setT] = useState("wallet");
  const [fiat, setF] = useState<any[]>([]); const [crypto, setC] = useState<any[]>([]); const [total, setTot] = useState(0);
  const [txs, setTxs] = useState<any[]>([]); const [kyc, setK] = useState("UNVERIFIED");
  const [to, setTo] = useState(""); const [sendAmt, setSA] = useState(""); const [sendCurr, setSC] = useState("USD"); const [sendMsg, setSM] = useState(""); const [sendErr, setSE] = useState("");
  const [curPw, setCP] = useState(""); const [newPw, setNP] = useState(""); const [pwMsg, setPM] = useState("");
  const [displayCurr, setDC] = useState("USD"); const [refCode] = useState("GEM" + Math.random().toString(36).slice(2,8).toUpperCase());
  const coinColors: Record<string,string> = { BTC:"#f7931a", ETH:"#627eea", SOL:"#9945ff", USDT:"#26a17b" };
  const txColors: Record<string,string> = { TRANSFER:"#a78bfa", ADMIN_FUNDING:"#22c55e", DEPOSIT:"#22c55e" };
  const txLabels: Record<string,string> = { TRANSFER:"Sent", ADMIN_FUNDING:"Deposited", DEPOSIT:"Received" };
  const SYM: Record<string,string> = { USD:"$",EUR:"€",GBP:"£",JPY:"¥",CHF:"CHF",CAD:"C$",AUD:"A$",CNY:"¥",INR:"₹",BRL:"R$",KRW:"₩",SGD:"S$",NZD:"NZ$",SEK:"kr",TRY:"₺",AED:"د.إ",SAR:"﷼",HKD:"HK$",THB:"฿",ZAR:"R",PLN:"zł",NGN:"₦",EGP:"£",KES:"KSh",COP:"$",ARS:"$",UAH:"₴",PKR:"₨",BDT:"৳",OMR:"﷼",KWD:"د.ك" };
  const ALL_CURRENCIES = ["USD","EUR","GBP","JPY","CHF","CAD","AUD","CNY","INR","BRL","MXN","SGD","KRW","SEK","TRY","AED","SAR","HKD","THB","ZAR","PLN","NGN","EGP","KES","COP","ARS","UAH","PKR","BDT","OMR","KWD"];
  const [rates, setRates] = useState<Record<string,number>>({});

  useEffect(() => {
    fetch("/api/auth/me").then(r=>r.json()).then(d => { if (!d.id) { window.location.href="/"; return; } setU(d); setK(d.kycStatus||"UNVERIFIED"); });
    fetch("/api/balances").then(r=>r.json()).then(d => { setF(d.balances||[]); setC(d.crypto||[]); setTot(d.totalUSD||0); });
    fetch("/api/transactions").then(r=>r.json()).then(d => setTxs(d.transactions||[]));
    fetch("/api/exchange-rates").then(r=>r.json()).then(d => { const m:Record<string,number>={}; (d.rates||[]).forEach((r:any)=>m[r.currency]=r.rate); setRates(m); }).catch(()=>{});
  }, []);

  const sendFunds = async(e:any) => { e.preventDefault(); setSM(""); setSE(""); try { const r=await fetch("/api/transfer",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({to,currency:sendCurr,amount:parseFloat(sendAmt)})}); const d=await r.json(); if(!r.ok) throw new Error(d.error); setSM(`✅ Sent ${sendAmt} ${sendCurr}`); setSA(""); setTo(""); } catch(e:any) { setSE(e.message); } };
  const changePw = async(e:any) => { e.preventDefault(); setPM(""); try { const r=await fetch("/api/auth/password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({currentPassword:curPw,newPassword:newPw})}); const d=await r.json(); if(!r.ok) throw new Error(d.error); setPM("✅ Password changed!"); setCP(""); setNP(""); } catch(e:any) { setPM(e.message); } };

  if (!user) return <div className="app"><div className="loading"/></div>;
  const fmt = (n:number) => "$"+n.toLocaleString("en-US",{minimumFractionDigits:2});
  const fmt2 = (n:number) => { const cu=displayCurr; const r=rates[cu]||1; const v=cu==="USD"?n:n/r; return (SYM[cu]||cu)+" "+v.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}) };

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <span className="font-display" style={{fontSize:"18px",fontWeight:"700"}}>🌍 Global Gemini <span className="text-gradient">Wallet</span></span>
          <div className="row">
            {[{k:"wallet",l:"💰 Wallet"},{k:"profile",l:"👤 Profile"},{k:"refer",l:"🔗 Refer"},{k:"settings",l:"⚙️ Settings"}].map(t=>(
              <button key={t.k} onClick={()=>setT(t.k)} className={`tab ${tab===t.k?"active":""}`}>{t.l}</button>
            ))}
            <button onClick={async()=>{await fetch("/api/auth/signout",{method:"POST"});window.location.href="/";}} className="btn btn-secondary btn-sm" style={{marginLeft:"8px"}}>Sign Out</button>
          </div>
        </div>
      </header>
      <main className="main">
        {tab==="wallet" && (
          <div className="fade-in">
            <div className="row-between" style={{marginBottom:"24px",flexWrap:"wrap",gap:"12px"}}>
              <div><h1 className="font-display" style={{fontSize:"28px",fontWeight:"700"}}>Welcome, {user.name}</h1>
                <div className="row" style={{marginTop:"8px",gap:"8px",flexWrap:"wrap"}}>
                  <p style={{fontSize:"36px",fontWeight:"700"}}><span className="text-gradient">{fmt2(total)}</span></p>
                  <select value={displayCurr} onChange={e=>setDC(e.target.value)} style={{padding:"4px 8px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"6px",color:"#d4af37",fontSize:"13px",fontWeight:"600",outline:"none",cursor:"pointer"}}>
                    {ALL_CURRENCIES.map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                  <span className="text-muted" style={{fontSize:"14px"}}>total</span>
                </div>
              </div>
              <div className="row-wrap">
                <Link href="/wallet/deposit" className="btn btn-primary">📥 Deposit</Link>
                <Link href="/wallet/withdraw" className="btn btn-secondary">📤 Withdraw</Link>
                <Link href="/wallet/swap" className="btn btn-secondary">🔄 Swap</Link>
                <Link href="/kyc" className="btn btn-secondary btn-sm">📋 KYC</Link>
              </div>
            </div>
            <div className="grid-2" style={{marginBottom:"24px"}}>
              <div className="card" style={{padding:"24px"}}>
                <h3 className="font-display" style={{fontSize:"16px",fontWeight:"600",marginBottom:"16px"}}>💵 Fiat</h3>
                {fiat.length===0 ? <p className="text-muted text-sm">No balance</p> : fiat.map((b:any)=>(
                  <div key={b.currency} className="row-between" style={{padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                    <div><span style={{fontWeight:"500"}}>{b.currency}</span><span style={{marginLeft:"8px",fontFamily:"Georgia,serif"}}>{b.amount.toLocaleString("en-US",{minimumFractionDigits:2})}</span></div>
                    <span className="text-gradient" style={{fontWeight:"500"}}>{fmt2(b.usdValue)}</span>
                  </div>
                ))}
              </div>
              <div className="card" style={{padding:"24px"}}>
                <h3 className="font-display" style={{fontSize:"16px",fontWeight:"600",marginBottom:"16px"}}>🪙 Crypto <span className="text-muted" style={{fontSize:"12px",fontWeight:"400"}}>Live</span></h3>
                {crypto.length===0 ? <p className="text-muted text-sm">No crypto</p> : crypto.map((b:any)=>(
                  <div key={b.symbol} className="row-between" style={{padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                    <div><span style={{fontWeight:"500",color:coinColors[b.symbol]||"#fff"}}>{b.symbol}</span>
                      <span style={{marginLeft:"8px",fontFamily:"Georgia,serif"}}>{b.amount.toLocaleString("en-US",{minimumFractionDigits:4})}</span>
                      <span className="text-muted text-xs" style={{marginLeft:"6px"}}>@ ${b.price?.toLocaleString()}</span></div>
                    <span className="text-gradient">{fmt2(b.usdValue)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card" style={{padding:"24px",marginBottom:"24px"}}>
              <h3 className="font-display" style={{fontSize:"16px",fontWeight:"600",marginBottom:"16px"}}>📤 Send</h3>
              {sendMsg&&<div className="badge badge-green" style={{marginBottom:"12px",padding:"10px",borderRadius:"8px",display:"block"}}>{sendMsg}</div>}
              {sendErr&&<div className="badge badge-red" style={{marginBottom:"12px",padding:"10px",borderRadius:"8px",display:"block"}}>{sendErr}</div>}
              <form onSubmit={sendFunds} className="row-wrap">
                <input type="text" value={to} onChange={e=>setTo(e.target.value)} placeholder="Email/Username" className="input" style={{flex:1,minWidth:"200px"}} required />
                <input type="number" step="0.01" min="0.01" value={sendAmt} onChange={e=>setSA(e.target.value)} placeholder="Amount" className="input" style={{width:"120px"}} required />
                <select value={sendCurr} onChange={e=>setSC(e.target.value)} className="input" style={{width:"90px"}}><option>USD</option><option>EUR</option><option>GBP</option><option>USDT</option><option>BTC</option><option>ETH</option><option>SOL</option></select>
                <button type="submit" className="btn btn-primary">Send</button>
              </form>
            </div>
            <div className="card" style={{padding:"24px"}}>
              <h3 className="font-display" style={{fontSize:"16px",fontWeight:"600",marginBottom:"16px"}}>📋 Transactions</h3>
              {txs.length===0 ? <p className="text-muted text-sm" style={{textAlign:"center",padding:"20px"}}>No transactions</p> : txs.slice(0,25).map((tx:any)=>(
                <div key={tx.id} className="row-between" style={{padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                  <div><span style={{fontSize:"13px",fontWeight:"500",color:txColors[tx.type]||"#d4af37"}}>{txLabels[tx.type]||tx.type}</span>{tx.description&&<p className="text-xs text-muted">{tx.description}</p>}</div>
                  <div style={{textAlign:"right"}}><span style={{fontSize:"13px",color:"#22c55e"}}>+{Number(tx.amount).toLocaleString("en-US",{minimumFractionDigits:2})} {tx.currency}</span><p className="text-xs" style={{color:"#4b5563"}}>{new Date(tx.createdAt).toLocaleDateString()}</p></div>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab==="profile" && <div className="card fade-in" style={{padding:"32px",maxWidth:"520px"}}><h2 className="font-display text-xl" style={{fontSize:"24px",fontWeight:"700",marginBottom:"24px"}}>👤 Profile</h2>
          {[{l:"Name",v:user.name},{l:"Username",v:"@"+user.username,c:"#d4af37"},{l:"Email",v:user.email},{l:"KYC",v:kyc,c:kyc==="VERIFIED"?"#22c55e":kyc==="PENDING"?"#facc15":"#ef4444"}].map(i=>(
            <div key={i.l} style={{marginBottom:"16px"}}><label className="text-xs text-muted">{i.l}</label><div style={{padding:"12px 16px",background:"rgba(255,255,255,0.04)",borderRadius:"10px",fontSize:"14px",color:i.c||"#fff"}}>{i.v}</div></div>
          ))}
        </div>}
        {tab==="refer" && <div className="card fade-in" style={{padding:"32px",maxWidth:"520px"}}><h2 className="font-display" style={{fontSize:"24px",fontWeight:"700",marginBottom:"24px"}}>🔗 Referral</h2>
          <div className="card" style={{background:"rgba(212,175,55,0.06)",borderColor:"rgba(212,175,55,0.15)",padding:"24px",textAlign:"center",marginBottom:"20px"}}><p className="text-xs text-muted">Your Code</p><p className="font-display" style={{fontSize:"32px",fontWeight:"700"}}><span className="text-gradient">{refCode}</span></p></div>
          <div className="grid-2" style={{gap:"12px"}}><div className="stat"><div className="stat-value" style={{color:"#60a5fa"}}>0</div><div className="stat-label">Referrals</div></div><div className="stat"><div className="stat-value" style={{color:"#22c55e"}}>$0</div><div className="stat-label">Earned</div></div></div>
        </div>}
        {tab==="settings" && <div className="card fade-in" style={{padding:"32px",maxWidth:"520px"}}><h2 className="font-display" style={{fontSize:"24px",fontWeight:"700",marginBottom:"24px"}}>⚙️ Settings</h2>
          {pwMsg&&<div className={`badge ${pwMsg.includes("✅")?"badge-green":"badge-red"}`} style={{marginBottom:"16px",padding:"10px",borderRadius:"8px",display:"block"}}>{pwMsg}</div>}
          <form onSubmit={changePw} style={{display:"flex",flexDirection:"column",gap:"12px"}}>
            <input type="password" value={curPw} onChange={e=>setCP(e.target.value)} placeholder="Current password" className="input" required />
            <input type="password" value={newPw} onChange={e=>setNP(e.target.value)} placeholder="New password" className="input" required />
            <button type="submit" className="btn btn-primary">Change</button>
          </form>
        </div>}
      </main>
    </div>
  );
}
DASH

# 4. Fix admin page - full widescreen
cat > app/admin/page.tsx << 'ADMIN'
"use client"; import { useState, useEffect } from "react"; import Link from "next/link";
export default function AdminPage() {
  const [users, setU] = useState<any[]>([]); const [email, setE] = useState(""); const [curr, setC] = useState("USD"); const [amt, setA] = useState(""); const [msg, setMsg] = useState(""); const [err, setErr] = useState("");
  const CURRENCIES = ["USD","EUR","GBP","JPY","CHF","CAD","AUD","CNY","INR","BRL","MXN","USDT","BTC","ETH","SOL"];
  useEffect(() => { fetch("/api/auth/me").then(r=>r.json()).then(d => { if (d.role!=="ADMIN") { window.location.href="/"; return; } fetch("/api/admin/users").then(r=>r.json()).then(d=>setU(d.users||[])); }); }, []);
  const fund = async(e:any) => { e.preventDefault(); setMsg(""); setErr(""); try { const r=await fetch("/api/admin/fund",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,currency:curr,amount:parseFloat(amt)})}); const d=await r.json(); if(!r.ok) throw new Error(d.error); setMsg(`✅ Deposited ${amt} ${curr} to ${email}`); setA(""); } catch(e:any) { setErr(e.message); } };
  const del = async(id:string) => { if(!confirm("Delete?")) return; await fetch("/api/admin/user",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:id})}); setU(u=>u.filter((x:any)=>x.id!==id)); };
  return (
    <div className="app">
      <header className="header"><div className="header-inner">
        <span className="font-display" style={{fontSize:"18px",fontWeight:"700"}}>🌍 Global Gemini <span className="text-gradient">Wallet</span> <span className="badge badge-gold" style={{marginLeft:"8px"}}>ADMIN</span></span>
        <div className="row">
          <Link href="/admin" className="tab active" style={{fontSize:"13px"}}>💫 Dashboard</Link>
          <Link href="/admin/kyc" className="tab" style={{fontSize:"13px"}}>📋 KYC</Link>
          <Link href="/admin/deposits" className="tab" style={{fontSize:"13px"}}>📥 Deposits</Link>
          <Link href="/admin/withdrawals" className="tab" style={{fontSize:"13px"}}>📤 Withdrawals</Link>
          <button onClick={async()=>{await fetch("/api/auth/signout",{method:"POST"});window.location.href="/";}} className="btn btn-secondary btn-sm">Sign Out</button>
        </div>
      </div></header>
      <main className="main">
        <div className="fade-in">
          <h1 className="font-display" style={{fontSize:"28px",fontWeight:"700",marginBottom:"24px"}}><span className="text-gradient">⚡ Admin Panel</span></h1>
          <div className="grid-4" style={{marginBottom:"24px"}}>
            <div className="stat"><div className="stat-value" style={{color:"#60a5fa"}}>{users.length}</div><div className="stat-label">Users</div></div>
            <div className="stat"><div className="stat-value" style={{color:"#facc15"}}>{users.filter((u:any)=>u.kycStatus==="PENDING").length}</div><div className="stat-label">KYC Pending</div></div>
            <div className="stat"><div className="stat-value" style={{color:"#22c55e"}}>{users.filter((u:any)=>u.kycStatus==="VERIFIED").length}</div><div className="stat-label">Verified</div></div>
            <div className="stat"><div className="stat-value" style={{color:"#a78bfa"}}>{users.filter((u:any)=>u.role==="USER").length}</div><div className="stat-label">Active</div></div>
          </div>
          <div className="grid-2" style={{gap:"24px"}}>
            <div className="card" style={{padding:"24px"}}>
              <h3 className="font-display" style={{fontSize:"16px",fontWeight:"600",marginBottom:"16px"}}>💫 Deposit to User</h3>
              {msg&&<div className="badge badge-green" style={{marginBottom:"12px",padding:"10px",borderRadius:"8px",display:"block"}}>{msg}</div>}
              {err&&<div className="badge badge-red" style={{marginBottom:"12px",padding:"10px",borderRadius:"8px",display:"block"}}>{err}</div>}
              <form onSubmit={fund} style={{display:"flex",flexDirection:"column",gap:"12px"}}>
                <select value={email} onChange={e=>setE(e.target.value)} className="input" required><option value="">Select user...</option>{users.filter((u:any)=>u.role!=="ADMIN").map((u:any)=><option key={u.id} value={u.email}>{u.name} ({u.email})</option>)}</select>
                <div className="row" style={{gap:"8px"}}>
                  <select value={curr} onChange={e=>setC(e.target.value)} className="input" style={{width:"100px"}}>{CURRENCIES.map(c=><option key={c} value={c}>{c}</option>)}</select>
                  <input type="number" step="0.01" min="0.01" value={amt} onChange={e=>setA(e.target.value)} placeholder="Amount" className="input" style={{flex:1}} required />
                </div>
                <button type="submit" className="btn btn-primary" style={{width:"100%"}}>💫 Deposit</button>
              </form>
            </div>
            <div className="card" style={{padding:"24px"}}>
              <h3 className="font-display" style={{fontSize:"16px",fontWeight:"600",marginBottom:"16px"}}>👥 Users ({users.length})</h3>
              <div style={{maxHeight:"400px",overflowY:"auto"}}>{users.map((u:any)=>(
                <div key={u.id} className="row-between" style={{padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                  <div><span style={{fontSize:"14px",fontWeight:"500"}}>{u.name}</span><span className="text-muted text-xs" style={{marginLeft:"6px"}}>{u.email}</span></div>
                  <div className="row" style={{gap:"6px"}}>
                    <span className={`badge ${u.kycStatus==="VERIFIED"?"badge-green":u.kycStatus==="PENDING"?"badge-blue":"badge-red"}`}>{u.kycStatus}</span>
                    <button onClick={()=>del(u.id)} className="btn btn-danger btn-sm" style={{padding:"4px 8px",fontSize:"10px"}}>Delete</button>
                  </div>
                </div>
              ))}</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
ADMIN

echo "✅ Ultimate fix complete! Pushing to GitHub..."
git add -A
git commit -m "Ultimate fix: animated bg, working deposit/withdraw, currency dropdown, widescreen admin"
git push
echo "✅ Deployed!"
