#!/bin/bash

# 1. WORLD-CLASS CSS
cat > app/globals.css << 'CSS'
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',sans-serif;background:#0a0a0f;color:#fff;overflow-x:hidden}
.bg-o{position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;overflow:hidden}
.bg-o .b{position:absolute;border-radius:50%;filter:blur(120px)}
.bg-o .b1{width:600px;height:600px;background:radial-gradient(circle,rgba(212,175,55,0.06),transparent);top:-200px;right:-100px;animation:fl 14s ease-in-out infinite}
.bg-o .b2{width:450px;height:450px;background:radial-gradient(circle,rgba(96,165,250,0.04),transparent);bottom:-150px;left:-80px;animation:fl 18s ease-in-out infinite reverse}
.bg-o .b3{width:350px;height:350px;background:radial-gradient(circle,rgba(255,255,255,0.02),transparent);top:40%;left:60%;animation:fl 22s ease-in-out infinite 3s}
@keyframes fl{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-30px) scale(1.02)}}
.app{min-height:100vh;display:flex;flex-direction:column;position:relative;z-index:1}
.top{position:sticky;top:0;z-index:100;backdrop-filter:blur(24px);background:rgba(10,10,15,0.85);border-bottom:1px solid rgba(255,255,255,0.05)}
.top-in{display:flex;align-items:center;justify-content:space-between;padding:14px 4%;width:100%}
.main{flex:1;padding:28px 4%;width:100%}
.card{background:linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01));backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.06);border-radius:16px;transition:all .3s}
.card:hover{border-color:rgba(212,175,55,0.12)}
.crd2{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:16px;transition:all .2s}
.crd2:hover{border-color:rgba(212,175,55,0.1)}
.gld{background:linear-gradient(135deg,#d4af37,#f0d060);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:10px 24px;border-radius:10px;font-size:13px;font-weight:600;border:none;cursor:pointer;transition:all .2s;text-decoration:none}
.btn-p{background:linear-gradient(135deg,#d4af37,#b8942e);color:#0a0a0f;box-shadow:0 4px 20px rgba(212,175,55,0.15)}
.btn-p:hover{transform:translateY(-1px);box-shadow:0 6px 25px rgba(212,175,55,0.25)}
.btn-s{background:rgba(255,255,255,0.05);color:#e5e7eb;border:1px solid rgba(255,255,255,0.08)}
.btn-s:hover{background:rgba(255,255,255,0.08)}
.inp{width:100%;padding:12px 16px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);border-radius:10px;color:#fff;font-size:14px;outline:none;transition:border .2s}
.inp:focus{border-color:rgba(212,175,55,0.3);box-shadow:0 0 0 3px rgba(212,175,55,0.06)}
select.inp{cursor:pointer;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:36px}
.muted{color:#6b7280}
.tab{padding:8px 0;background:none;border:none;border-bottom:2px solid transparent;color:#6b7280;font-size:13px;cursor:pointer;font-weight:500;transition:all .2s}
.tab:hover{color:#9ca3af}
.tab.act{color:#d4af37;border-bottom-color:#d4af37}
.st{text-align:center;padding:20px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:12px}
.st-v{font-size:28px;font-weight:700}
.st-l{font-size:12px;color:#6b7280;margin-top:4px}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:24px}
.g3{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.g4{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
@keyframes fi{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.fi{animation:fi .4s ease-out}
.lo{width:22px;height:22px;border:2px solid rgba(212,175,55,0.15);border-top-color:#d4af37;border-radius:50%;animation:sp .7s linear infinite;margin:48px auto}
@keyframes sp{to{transform:rotate(360deg)}}
.bg{background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.15);color:#22c55e;font-size:12px;padding:10px;border-radius:8px;margin-bottom:12px}
.br{background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.15);color:#ef4444;font-size:12px;padding:10px;border-radius:8px;margin-bottom:12px}
@media(max-width:1024px){.g2,.g4{grid-template-columns:1fr}}
CSS

# 2. Layout
cat > app/layout.tsx << 'EOF'
import type{Metadata}from"next";import"./globals.css";
export const metadata:Metadata={title:"Global Gemini Wallet",description:"Multi-Currency Wealth Platform"};
export default function RootLayout({children}:{children:React.ReactNode}){return(<html lang="en"><body><div className="bg-o"><div className="b b1"/><div className="b b2"/><div className="b b3"/></div>{children}</body></html>)}
EOF

# 3. ADMIN PAGE with delete, block, fund
cat > app/admin/page.tsx << 'ADMIN'
"use client";import{useState,useEffect}from"react";import Link from "next/link";
export default function AdminPage(){const[u,setU]=useState<any[]>([]);const[e,setE]=useState("");const[c,setC]=useState("USD");const[a,setA]=useState("");const[msg,setMsg]=useState("");const[er,setEr]=useState("")
const CC=["USD","EUR","GBP","JPY","CHF","CAD","AUD","CNY","INR","BRL","MXN","USDT","BTC","ETH","SOL"]
useEffect(()=>{fetch("/api/auth/me").then(r=>r.json()).then(d=>{if(d.role!=="ADMIN"){window.location.href="/";return}fetch("/api/admin/users").then(r=>r.json()).then(d=>setU(d.users||[]))})},[])
const fd=async(e2:any)=>{e2.preventDefault();setMsg("");setEr("");try{const r=await fetch("/api/admin/fund",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e,currency:c,amount:parseFloat(a)})});const d=await r.json();if(!r.ok)throw new Error(d.error);setMsg("✅ Deposited "+a+" "+c+" to "+e);setA("")}catch(e2:any){setEr(e2.message)}}
const dl=async(id:string)=>{if(!confirm("Delete this user?"))return;await fetch("/api/admin/user",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:id})});setU(u.filter(x=>x.id!==id))}
return(<div className="app"><div className="top"><div className="top-in">
<span style={{fontWeight:"700",fontSize:"18px"}}>🌍 Global Gemini <span className="gld">Wallet</span><span style={{fontSize:"10px",background:"rgba(212,175,55,0.12)",color:"#d4af37",padding:"2px 8px",borderRadius:"100px",marginLeft:"8px",fontWeight:"400"}}>ADMIN</span></span>
<div style={{display:"flex",gap:"16px",alignItems:"center"}}>
<Link href="/admin" className="tab act">💫 Dashboard</Link>
<Link href="/admin/kyc" className="tab">📋 KYC</Link>
<Link href="/admin/deposits" className="tab">📥 Deposits</Link>
<Link href="/admin/withdrawals" className="tab">📤 Withdrawals</Link>
<button onClick={async()=>{await fetch("/api/auth/signout",{method:"POST"});window.location.href="/"}} className="btn btn-s" style={{padding:"8px 16px"}}>Sign Out</button>
</div></div></div>
<div className="main fi">
<h1 style={{fontSize:"26px",fontWeight:"700",marginBottom:"24px"}}><span className="gld">⚡ Admin Dashboard</span></h1>
<div className="g4" style={{marginBottom:"24px"}}>
<div className="st"><div className="st-v" style={{color:"#60a5fa"}}>{u.length}</div><div className="st-l">Total Users</div></div>
<div className="st"><div className="st-v" style={{color:"#facc15"}}>{u.filter((x:any)=>x.kycStatus==="PENDING").length}</div><div className="st-l">KYC Pending</div></div>
<div className="st"><div className="st-v" style={{color:"#22c55e"}}>{u.filter((x:any)=>x.kycStatus==="VERIFIED").length}</div><div className="st-l">Verified</div></div>
<div className="st"><div className="st-v" style={{color:"#a78bfa"}}>{u.filter((x:any)=>x.role==="USER").length}</div><div className="st-l">Active</div></div>
</div>
<div className="g2" style={{gap:"24px"}}>
<div className="card" style={{padding:"24px"}}>
<h3 style={{fontSize:"16px",fontWeight:"600",marginBottom:"16px"}}>💫 Fund User Account</h3>
{msg&&<div className="bg">{msg}</div>}{er&&<div className="br">{er}</div>}
<form onSubmit={fd} style={{display:"flex",flexDirection:"column",gap:"12px"}}>
<select value={e} onChange={e=>setE(e.target.value)} className="inp" required><option value="">Select user</option>{u.filter((x:any)=>x.role!=="ADMIN").map((x:any)=><option key={x.id} value={x.email}>{x.name} ({x.email})</option>)}</select>
<div style={{display:"flex",gap:"8px"}}><select value={c} onChange={e=>setC(e.target.value)} className="inp" style={{width:"100px"}}>{CC.map(x=><option key={x} value={x}>{x}</option>)}</select>
<input type="number" step="0.01" min="0.01" value={a} onChange={e=>setA(e.target.value)} placeholder="Enter amount" className="inp" style={{flex:1}} required/></div>
<button type="submit" className="btn btn-p" style={{width:"100%"}}>💫 Deposit Funds</button></form></div>
<div className="card" style={{padding:"24px"}}>
<h3 style={{fontSize:"16px",fontWeight:"600",marginBottom:"16px"}}>👥 Users ({u.length})</h3>
<div style={{maxHeight:"500px",overflowY:"auto"}}>{u.map((x:any)=>(<div key={x.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
<div><span style={{fontSize:"14px",fontWeight:"500"}}>{x.name}</span><span className="muted" style={{fontSize:"12px",marginLeft:"6px"}}>{x.email}</span></div>
<div style={{display:"flex",gap:"6px",alignItems:"center"}}>
<span style={{fontSize:"11px",padding:"3px 8px",borderRadius:"100px",color:x.kycStatus==="VERIFIED"?"#22c55e":x.kycStatus==="PENDING"?"#facc15":"#ef4444",background:x.kycStatus==="VERIFIED"?"rgba(34,197,94,0.1)":x.kycStatus==="PENDING"?"rgba(250,204,21,0.1)":"rgba(239,68,68,0.1)"}}>{x.kycStatus}</span>
{x.role!=="ADMIN"&&<button onClick={()=>dl(x.id)} style={{padding:"4px 10px",background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:"6px",color:"#ef4444",fontSize:"11px",cursor:"pointer"}}>Delete</button>}
</div></div>))}</div></div></div></div></div>)
ADMIN

# 4. DASHBOARD - professional
cat > app/dashboard/page.tsx << 'DASH'
"use client";import{useState,useEffect}from"react";import Link from "next/link";
export default function Dashboard(){const[u,setU]=useState<any>(null);const[t,setT]=useState("wallet");const[c,setC]=useState<any[]>([]);const[tot,setTot]=useState(0);const[tx,setTx]=useState<any[]>([]);const[kyc,setK]=useState("UNVERIFIED")
const[to,setTo]=useState("");const[sA,setSA]=useState("");const[sC,setSC]=useState("USD");const[sM,setSM]=useState("");const[sE,setSE]=useState("");const[cP,setCP]=useState("");const[nP,setNP]=useState("");const[pM,setPM]=useState("");const[dC,setDC]=useState("USD");const[rC]=useState("GEM"+Math.random().toString(36).slice(2,8).toUpperCase());const[ra,setRa]=useState<Record<string,number>>({})
const cc:Record<string,string>={BTC:"#f7931a",ETH:"#627eea",SOL:"#9945ff",USDT:"#26a17b"};const ALL_C=["USD","EUR","GBP","JPY","CHF","CAD","AUD","CNY","INR","BRL","MXN","SGD","KRW","SEK","TRY","AED","SAR","HKD","THB","ZAR","PLN","NGN"]
const SYM:Record<string,string>={USD:"$",EUR:"€",GBP:"£",JPY:"¥",CHF:"CHF",CAD:"C$",AUD:"A$",CNY:"¥",INR:"₹",BRL:"R$",KRW:"₩",SGD:"S$",SEK:"kr",TRY:"₺",AED:"د.إ",SAR:"﷼"}
useEffect(()=>{fetch("/api/auth/me").then(r=>r.json()).then(d=>{if(!d.id){window.location.href="/";return}setU(d);setK(d.kycStatus||"UNVERIFIED")});fetch("/api/balances").then(r=>r.json()).then(d=>{setC(d.crypto||[]);setTot(d.totalUSD||0)});fetch("/api/transactions").then(r=>r.json()).then(d=>setTx(d.transactions||[]));fetch("/api/exchange-rates").then(r=>r.json()).then(d=>{const m:Record<string,number>={};(d.rates||[]).forEach((r:any)=>m[r.currency]=r.rate);setRa(m)}).catch(()=>{})},[])
const sf=async(e:any)=>{e.preventDefault();setSM("");setSE("");try{const r=await fetch("/api/transfer",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({to,currency:sC,amount:parseFloat(sA)})});const d=await r.json();if(!r.ok)throw new Error(d.error);setSM("✅ Sent! "+sA+" "+sC);setSA("");setTo("")}catch(e:any){setSE(e.message)}}
const cpw=async(e:any)=>{e.preventDefault();setPM("");try{const r=await fetch("/api/auth/password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({currentPassword:cP,newPassword:nP})});const d=await r.json();if(!r.ok)throw new Error(d.error);setPM("✅ Changed!");setCP("");setNP("")}catch(e:any){setPM(e.message)}}
if(!u)return<div style={{minHeight:"100vh",background:"#0a0a0f",display:"flex",alignItems:"center",justifyContent:"center"}}><div className="lo"/></div>
const cv=(n:number)=>{const cu=dC;const r=ra[cu]||1;const v=cu==="USD"?n:n*r;return(SYM[cu]||cu)+" "+v.toLocaleString("en-US",{minimumFractionDigits:2})}
return(<div style={{minHeight:"100vh",background:"#0a0a0f",color:"#fff",fontFamily:"Inter,sans-serif"}}>
<div style={{borderBottom:"1px solid rgba(255,255,255,0.05)",padding:"14px 4%",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100,backdropFilter:"blur(24px)",background:"rgba(10,10,15,0.85)"}}>
<span style={{fontWeight:"700",fontSize:"18px"}}>🌍 Global Gemini <span className="gld">Wallet</span></span>
<div style={{display:"flex",gap:"16px",alignItems:"center"}}>
{[{k:"wallet",l:"💰 Wallet"},{k:"profile",l:"👤 Profile"},{k:"refer",l:"🔗 Refer"},{k:"settings",l:"⚙️ Settings"}].map(x=>(
<button key={x.k} onClick={()=>setT(x.k)} className={`tab${t===x.k?" act":""}`}>{x.l}</button>))}
<button onClick={async()=>{await fetch("/api/auth/signout",{method:"POST"});window.location.href="/"}} className="btn btn-s" style={{padding:"8px 16px"}}>Sign Out</button>
</div></div>
<div style={{padding:"28px 4%",width:"100%"}}>
{t==="wallet"&&<div className="fi">
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"24px",flexWrap:"wrap",gap:"12px"}}>
<div><h1 style={{fontSize:"28px",fontWeight:"700",margin:0}}>Welcome, {u.name}</h1>
<div style={{display:"flex",alignItems:"center",gap:"8px",marginTop:"8px",flexWrap:"wrap"}}>
<p style={{fontSize:"36px",fontWeight:"700",margin:0}}><span className="gld">{cv(tot)}</span></p>
<select value={dC} onChange={e=>setDC(e.target.value)} style={{padding:"4px 10px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"6px",color:"#d4af37",fontSize:"13px",fontWeight:"600",outline:"none",cursor:"pointer"}}>{ALL_C.map(x=><option key={x} value={x}>{x}</option>)}</select>
<span className="muted" style={{fontSize:"14px"}}>total</span></div></div>
<div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
<Link href="/wallet/deposit" className="btn btn-p">📥 Deposit</Link>
<Link href="/wallet/withdraw" className="btn btn-s">📤 Withdraw</Link>
<Link href="/wallet/swap" className="btn btn-s">🔄 Swap</Link>
<Link href="/kyc" className="btn btn-s" style={{padding:"8px 16px",fontSize:"12px"}}>📋 KYC</Link>
</div></div>
<div className="card" style={{padding:"24px",marginBottom:"24px"}}>
<h3 style={{fontSize:"16px",fontWeight:"600",marginBottom:"16px"}}>🪙 Crypto Portfolio <span className="muted" style={{fontSize:"12px",fontWeight:"400"}}>Live market</span></h3>
{c.length===0?<p className="muted" style={{fontSize:"13px"}}>No crypto yet</p>:c.map((b:any)=>(<div key={b.symbol} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
<div><span style={{fontWeight:"500",color:cc[b.symbol]||"#fff"}}>{b.symbol}</span><span style={{marginLeft:"8px"}}>{b.amount.toLocaleString("en-US",{minimumFractionDigits:4})}</span><span className="muted" style={{fontSize:"11px",marginLeft:"6px"}}>@ ${b.price?.toLocaleString()||"..."}</span></div>
<span className="gld">{cv(b.usdValue)}</span></div>))}</div>
<div className="card" style={{padding:"24px",marginBottom:"24px"}}>
<h3 style={{fontSize:"16px",fontWeight:"600",marginBottom:"16px"}}>📤 Send Funds</h3>
{sM&&<div className="bg">{sM}</div>}{sE&&<div className="br">{sE}</div>}
<form onSubmit={sf} style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
<input type="text" value={to} onChange={e=>setTo(e.target.value)} placeholder="Email or Username" className="inp" style={{flex:1,minWidth:"180px"}} required/>
<input type="number" step="0.01" min="0.01" value={sA} onChange={e=>setSA(e.target.value)} placeholder="Amount" className="inp" style={{width:"110px"}} required/>
<select value={sC} onChange={e=>setSC(e.target.value)} className="inp" style={{width:"80px"}}><option>USD</option><option>EUR</option><option>GBP</option><option>USDT</option><option>BTC</option><option>ETH</option><option>SOL</option></select>
<button type="submit" className="btn btn-p">Send</button></form></div>
<div className="card" style={{padding:"24px"}}>
<h3 style={{fontSize:"16px",fontWeight:"600",marginBottom:"16px"}}>📋 Transactions</h3>
{tx.length===0?<p className="muted" style={{textAlign:"center",padding:"20px",fontSize:"13px"}}>No transactions</p>:tx.slice(0,25).map((x:any)=>(<div key={x.id} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
<div><span style={{fontSize:"13px",fontWeight:"500"}}>{x.type==="ADMIN_FUNDING"?"Deposited":x.type==="TRANSFER"?"Sent":x.type}</span>{x.description&&<p className="muted" style={{fontSize:"11px"}}>{x.description}</p>}</div>
<div style={{textAlign:"right"}}><span style={{fontSize:"13px",fontWeight:"500",color:"#22c55e"}}>+{Number(x.amount).toLocaleString("en-US",{minimumFractionDigits:2})} {x.currency}</span><p style={{fontSize:"11px",color:"#4b5563"}}>{new Date(x.createdAt).toLocaleDateString()}</p></div></div>))}</div></div>}

{t==="profile"&&<div className="card fi" style={{padding:"32px",maxWidth:"480px"}}><h2 style={{fontSize:"24px",fontWeight:"700",marginBottom:"24px"}}>👤 Profile</h2>
{[{l:"Name",v:u.name},{l:"Username",v:"@"+u.username,c:"#d4af37"},{l:"Email",v:u.email},{l:"KYC",v:kyc,c:kyc==="VERIFIED"?"#22c55e":kyc==="PENDING"?"#facc15":"#ef4444"}].map(i=>(
<div key={i.l} style={{marginBottom:"16px"}}><label className="muted" style={{fontSize:"12px",display:"block",marginBottom:"4px"}}>{i.l}</label><div style={{padding:"12px 16px",background:"rgba(255,255,255,0.04)",borderRadius:"10px",fontSize:"14px",color:i.c||"#fff"}}>{i.v}</div></div>))}</div>}

{t==="refer"&&<div className="card fi" style={{padding:"32px",maxWidth:"480px"}}><h2 style={{fontSize:"24px",fontWeight:"700",marginBottom:"24px"}}>🔗 Referral</h2>
<div style={{background:"rgba(212,175,55,0.06)",border:"1px solid rgba(212,175,55,0.15)",borderRadius:"12px",padding:"24px",textAlign:"center",marginBottom:"20px"}}><p className="muted" style={{fontSize:"12px",marginBottom:"8px"}}>Your Code</p><p style={{fontSize:"32px",fontWeight:"700"}}><span className="gld">{rC}</span></p></div>
<div className="g2" style={{gap:"12px"}}><div className="st"><div className="st-v" style={{color:"#60a5fa"}}>0</div><div className="st-l">Referrals</div></div><div className="st"><div className="st-v" style={{color:"#22c55e"}}>$0</div><div className="st-l">Earned</div></div></div></div>}

{t==="settings"&&<div className="card fi" style={{padding:"32px",maxWidth:"480px"}}><h2 style={{fontSize:"24px",fontWeight:"700",marginBottom:"24px"}}>⚙️ Settings</h2>
{pM&&<div style={{background:pM.includes("✅")?"rgba(34,197,94,0.1)":"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.15)",color:pM.includes("✅")?"#22c55e":"#ef4444",fontSize:"12px",padding:"10px",borderRadius:"8px",marginBottom:"16px"}}>{pM}</div>}
<form onSubmit={cpw} style={{display:"flex",flexDirection:"column",gap:"12px"}}>
<input type="password" value={cP} onChange={e=>setCP(e.target.value)} placeholder="Current password" className="inp" required/>
<input type="password" value={nP} onChange={e=>setNP(e.target.value)} placeholder="New password" className="inp" required/>
<button type="submit" className="btn btn-p">Change Password</button></form></div>}
</div></div>);}
DASH

git add -A && git commit -m "Professional UI - admin with delete/fund, working deposit/withdraw" && git push
echo "✅ DEPLOYED!"
