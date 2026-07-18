#!/bin/bash
set -e

# 1. Create missing wallet pages  
mkdir -p app/wallet/deposit app/wallet/withdraw app/wallet/swap

# Simple deposit page
cat > app/wallet/deposit/page.tsx << 'DEP'
"use client";import{useState}from"react";import Link from "next/link";
const A={"BTC-Bitcoin":"14J6KfQzXyLV8gLUKMWch2S3hjJvkMy5Rc","USDT-ERC20":"0xa7b97439665f545adb3bbc431ceb5053d4b46f49","USDT-BEP20":"0xa7b97439665f545adb3bbc431ceb5053d4b46f49","USDT-TRC20":"TLgjfeg8Mqw5ueo1CGC8eTb4EHysPMMA6S","SOL-Solana":"FQy4HArVdBbZ87AHrbfdhSXRgyE5NUbrh6GaL8enMUeh","ETH-ERC20":"0x09B0E6D01fb1DeDf172933cC1673aAf460353AAD"}
export default function Page(){const[m,setM]=useState("CRYPTO");const[a,setA]=useState("USDT");const[n,setN]=useState("ERC20");const[s,setS]=useState<"form"|"done">("form")
const ads=[{s:"USDT",n:["ERC20","BEP20","TRC20"]},{s:"BTC",n:["Bitcoin"]},{s:"ETH",n:["ERC20"]},{s:"SOL",n:["Solana"]}]
const ca=ads.find(x=>x.s===a)
if(s==="done")return(<div className="min-h-screen" style={{background:"#0a0a0f",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}><div className="card" style={{padding:"32px",maxWidth:"440px",width:"100%",textAlign:"center"}}>
<div style={{fontSize:"48px",marginBottom:"12px"}}>📥</div><h2 style={{fontSize:"20px",fontWeight:"700",fontFamily:"Georgia,serif",marginBottom:"8px"}}>Deposit {a}</h2>
<p className="text-muted text-sm" style={{marginBottom:"16px"}}>Send to:</p>
<div style={{background:"rgba(212,175,55,0.06)",border:"1px solid rgba(212,175,55,0.15)",borderRadius:"10px",padding:"12px",marginBottom:"16px",wordBreak:"break-all",fontSize:"12px",fontFamily:"monospace",color:"#d4af37"}}>{A[a+"-"+n]||"N/A"}</div>
<div style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.15)",borderRadius:"8px",padding:"12px",marginBottom:"16px"}}><p style={{color:"#ef4444",fontSize:"11px",margin:0}}>⚠️ Only send {a} on {n} network</p></div>
<p style={{color:"#facc15",fontSize:"12px",marginBottom:"16px"}}>⏳ Notify admin after sending</p>
<Link href="/dashboard" className="btn btn-primary">Dashboard</Link>
</div></div>)
return(<div className="min-h-screen" style={{background:"#0a0a0f",padding:"24px 5%"}}><div style={{maxWidth:"600px",margin:"0 auto"}}>
<Link href="/dashboard" style={{color:"#6b7280",fontSize:"13px",textDecoration:"none"}}>← Dashboard</Link>
<h1 style={{fontSize:"24px",fontWeight:"700",fontFamily:"Georgia,serif",margin:"16px 0 24px"}}>📥 Deposit</h1>
<div className="card" style={{padding:"24px"}}>
<h3 style={{fontSize:"14px",fontWeight:"600",marginBottom:"12px"}}>Select Asset</h3>
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(90px,1fr))",gap:"8px",marginBottom:"20px"}}>
<button onClick={()=>{setM("CRYPTO")}} style={{padding:"12px",borderRadius:"10px",border:m==="CRYPTO"?"2px solid #d4af37":"1px solid rgba(255,255,255,0.08)",background:m==="CRYPTO"?"rgba(212,175,55,0.1)":"rgba(255,255,255,0.03)",color:"#fff",cursor:"pointer",fontSize:"12px",textAlign:"center"}}><div style={{fontSize:"20px"}}>₿</div>Crypto</button>
</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"16px"}}>
<select value={a} onChange={e=>{setA(e.target.value);const x=ads.find(y=>y.s===e.target.value);if(x)setN(x.n[0])}} className="input">{ads.map(x=><option key={x.s} value={x.s}>{x.s}</option>)}</select>
<select value={n} onChange={e=>setN(e.target.value)} className="input">{ca?.n.map(x=><option key={x} value={x}>{x}</option>)}</select>
</div>
<button onClick={()=>setS("done")} className="btn btn-primary" style={{width:"100%"}}>Get Address</button>
</div></div></div>)}
DEP

# Simple withdraw page
cat > app/wallet/withdraw/page.tsx << 'WD'
"use client";import{useState}from"react";import Link from "next/link";
export default function Page(){const[m,setM]=useState("UPI");const[c,setC]=useState("USD");const[a,setA]=useState("");const[d,setD]=useState<Record<string,string>>({});const[s,setS]=useState<"form"|"done">("form")
const mt=[{id:"UPI",f:[{k:"upi",pl:"UPI ID"}]},{id:"BANK",f:[{k:"name",pl:"Full Name"},{k:"acc",pl:"Account No"},{k:"ifsc",pl:"IFSC"}]},{id:"PAYPAL",f:[{k:"email",pl:"PayPal Email"}]},{id:"CRYPTO",f:[{k:"addr",pl:"Wallet Address"},{k:"net",pl:"Network"}]}]
if(s==="done")return(<div className="min-h-screen" style={{background:"#0a0a0f",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}><div className="card" style={{padding:"32px",textAlign:"center",maxWidth:"400px"}}>
<div style={{fontSize:"48px",marginBottom:"12px"}}>📤</div><h2 style={{fontSize:"20px",fontWeight:"700"}}>Submitted</h2><p style={{color:"#facc15",fontSize:"12px",margin:"12px 0"}}>⏳ Pending admin approval</p>
<Link href="/dashboard" className="btn btn-primary">Dashboard</Link></div></div>)
return(<div className="min-h-screen" style={{background:"#0a0a0f",padding:"24px 5%"}}><div style={{maxWidth:"560px",margin:"0 auto"}}>
<Link href="/dashboard" style={{color:"#6b7280",fontSize:"13px"}}>← Dashboard</Link>
<h1 style={{fontSize:"24px",fontWeight:"700",fontFamily:"Georgia,serif",margin:"16px 0 24px"}}>📤 Withdraw</h1>
<div className="card" style={{padding:"24px"}}>
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(80px,1fr))",gap:"8px",marginBottom:"20px"}}>
{mt.map(x=>(<button key={x.id} onClick={()=>{setM(x.id);setD({})}} style={{padding:"12px",borderRadius:"10px",border:m===x.id?"2px solid #d4af37":"1px solid rgba(255,255,255,0.08)",background:m===x.id?"rgba(212,175,55,0.1)":"rgba(255,255,255,0.03)",color:"#fff",cursor:"pointer",fontSize:"12px",textAlign:"center"}}>{x.id}</button>))}
</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"16px"}}>
<select value={c} onChange={e=>setC(e.target.value)} className="input"><option>USD</option><option>EUR</option><option>GBP</option><option>USDT</option><option>BTC</option><option>ETH</option><option>SOL</option></select>
<input type="number" step="0.01" min="1" value={a} onChange={e=>setA(e.target.value)} placeholder="Amount" className="input" required/>
</div>
{mt.find(x=>x.id===m)?.f.map(x=>(<input key={x.k} type="text" value={d[x.k]||""} onChange={e=>setD({...d,[x.k]:e.target.value})} placeholder={x.pl} className="input" style={{marginBottom:"8px"}} required/>))}
<button onClick={()=>setS("done")} className="btn btn-primary" style={{width:"100%",marginTop:"8px"}}>Submit</button>
</div></div></div>)}
WD

# Simple swap page
cat > app/wallet/swap/page.tsx << 'SWP'
"use client";import{useState}from"react";import Link from "next/link";
export default function Page(){const[f,setF]=useState("USD");const[t,setT]=useState("USDT");const[a,setA]=useState("");const[r,setR]=useState<any>(null);const[e,setE]=useState("")
const sw=async()=>{if(f===t){setE("Select different currencies");return}try{const res=await fetch("/api/swap",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({from:f,to:t,amount:parseFloat(a)})});const d=await res.json();if(!res.ok)throw new Error(d.error);setR(d)}catch(e2:any){setE(e2.message)}}
const IP={width:"100%",padding:"12px 14px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"10px",color:"#fff",fontSize:"14px",outline:"none"}
return(<div className="min-h-screen" style={{background:"#0a0a0f",padding:"24px 5%"}}><div style={{maxWidth:"480px",margin:"0 auto"}}>
<Link href="/dashboard" style={{color:"#6b7280",fontSize:"13px"}}>← Dashboard</Link>
<h1 style={{fontSize:"24px",fontWeight:"700",fontFamily:"Georgia,serif",margin:"16px 0 24px"}}>🔄 Swap</h1>
{e&&<div className="badge badge-red" style={{marginBottom:"16px",padding:"12px",borderRadius:"8px",display:"block"}}>{e}</div>}
{r&&<div className="card" style={{padding:"24px",marginBottom:"20px",textAlign:"center",background:"rgba(34,197,94,0.06)",borderColor:"rgba(34,197,94,0.15)"}}>
<p style={{fontSize:"16px"}}>{r.amount} {r.from} → <strong style={{color:"#22c55e",fontSize:"20px"}}>{r.received} {r.to}</strong></p>
<button onClick={()=>setR(null)} className="btn btn-primary btn-sm" style={{marginTop:"12px"}}>Swap Again</button>
</div>}
<div className="card" style={{padding:"24px"}}>
<label className="text-xs text-muted">From</label>
<div style={{display:"flex",gap:"8px",marginBottom:"16px",marginTop:"4px"}}>
<select value={f} onChange={e=>setF(e.target.value)} className="input" style={{width:"90px"}}><option>USD</option><option>USDT</option><option>BTC</option><option>ETH</option><option>SOL</option></select>
<input type="number" step="0.01" value={a} onChange={e=>setA(e.target.value)} placeholder="0.00" className="input" style={{flex:1}}/>
</div>
<div style={{textAlign:"center",marginBottom:"16px"}}>
<button onClick={()=>{setF(t);setT(f)}} style={{width:"44px",height:"44px",borderRadius:"50%",background:"rgba(212,175,55,0.1)",border:"1px solid rgba(212,175,55,0.2)",color:"#d4af37",fontSize:"18px",cursor:"pointer"}}>⇅</button>
</div>
<label className="text-xs text-muted">To</label>
<select value={t} onChange={e=>setT(e.target.value)} className="input" style={{marginTop:"4px",marginBottom:"16px"}}><option>USDT</option><option>USD</option><option>BTC</option><option>ETH</option><option>SOL</option></select>
<button onClick={sw} className="btn btn-primary" style={{width:"100%"}}>Swap</button>
</div></div></div>)}
SWP

# 3. Update dashboard with fixed currency conversion
cat > app/dashboard/page.tsx << 'DASH'
"use client";import{useState,useEffect}from"react";import Link from "next/link";
export default function Dashboard(){const[u,setU]=useState<any>(null);const[t,setT]=useState("wallet");const[c,setC]=useState<any[]>([]);const[tot,setTot]=useState(0);const[tx,setTx]=useState<any[]>([]);const[kyc,setK]=useState("UNVERIFIED");const[to,setTo]=useState("");const[sA,setSA]=useState("");const[sC,setSC]=useState("USD");const[sM,setSM]=useState("");const[sE,setSE]=useState("");const[cP,setCP]=useState("");const[nP,setNP]=useState("");const[pM,setPM]=useState("");const[dC,setDC]=useState("USD");const[rC]=useState("GEM"+Math.random().toString(36).slice(2,8).toUpperCase());const[ra,setRa]=useState<Record<string,number>>({})
const cc:Record<string,string>={BTC:"#f7931a",ETH:"#627eea",SOL:"#9945ff",USDT:"#26a17b"};const ALL_C=["USD","EUR","GBP","JPY","CHF","CAD","AUD","CNY","INR","BRL","MXN","SGD","KRW","SEK","TRY","AED","SAR","HKD","THB","ZAR","PLN","NGN"]
const SYM:Record<string,string>={USD:"$",EUR:"€",GBP:"£",JPY:"¥",CHF:"CHF",CAD:"C$",AUD:"A$",CNY:"¥",INR:"₹",BRL:"R$",KRW:"₩",SGD:"S$",SEK:"kr",TRY:"₺",AED:"د.إ",SAR:"﷼"}
useEffect(()=>{fetch("/api/auth/me").then(r=>r.json()).then(d=>{if(!d.id){window.location.href="/";return}setU(d);setK(d.kycStatus||"UNVERIFIED")});fetch("/api/balances").then(r=>r.json()).then(d=>{setC(d.crypto||[]);setTot(d.totalUSD||0)});fetch("/api/transactions").then(r=>r.json()).then(d=>setTx(d.transactions||[]));fetch("/api/exchange-rates").then(r=>r.json()).then(d=>{const m:Record<string,number>={};(d.rates||[]).forEach((r:any)=>m[r.currency]=r.rate);setRa(m)}).catch(()=>{})},[])
const sf=async(e:any)=>{e.preventDefault();setSM("");setSE("");try{const r=await fetch("/api/transfer",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({to,currency:sC,amount:parseFloat(sA)})});const d=await r.json();if(!r.ok)throw new Error(d.error);setSM("✅ Sent! "+sA+" "+sC);setSA("");setTo("")}catch(e:any){setSE(e.message)}}
const cpw=async(e:any)=>{e.preventDefault();setPM("");try{const r=await fetch("/api/auth/password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({currentPassword:cP,newPassword:nP})});const d=await r.json();if(!r.ok)throw new Error(d.error);setPM("✅ Changed!");setCP("");setNP("")}catch(e:any){setPM(e.message)}}
if(!u)return<div style={{minHeight:"100vh",background:"#0a0a0f",display:"flex",alignItems:"center",justifyContent:"center"}}><div className="loading"/></div>
const cv=(n:number)=>{const cu=dC;const r=ra[cu]||1;const v=cu==="USD"?n:n*r;return(SYM[cu]||cu)+" "+v.toLocaleString("en-US",{minimumFractionDigits:2})}
return(<div style={{minHeight:"100vh",background:"#0a0a0f",color:"#fff",fontFamily:"Inter,sans-serif"}}>
<div style={{borderBottom:"1px solid rgba(255,255,255,0.06)",padding:"14px 5%",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100,backdropFilter:"blur(20px)",background:"rgba(10,10,15,0.85)"}}>
<span style={{fontWeight:"700",fontSize:"18px"}}>🌍 Global Gemini <span style={{background:"linear-gradient(135deg,#d4af37,#f0d060)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Wallet</span></span>
<div style={{display:"flex",gap:"16px",alignItems:"center"}}>
{[{k:"wallet",l:"💰 Wallet"},{k:"profile",l:"👤 Profile"},{k:"refer",l:"🔗 Refer"},{k:"settings",l:"⚙️ Settings"}].map(x=>(
<button key={x.k} onClick={()=>setT(x.k)} style={{padding:"6px 0",background:"none",border:"none",borderBottom:t===x.k?"2px solid #d4af37":"2px solid transparent",color:t===x.k?"#d4af37":"#6b7280",fontSize:"14px",cursor:"pointer",fontWeight:"500"}}>{x.l}</button>))}
<button onClick={async()=>{await fetch("/api/auth/signout",{method:"POST"});window.location.href="/"}} style={{padding:"8px 16px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"8px",color:"#e5e7eb",fontSize:"12px",cursor:"pointer"}}>Sign Out</button>
</div></div>
<div style={{padding:"28px 5%",width:"100%"}}>
{t==="wallet"&&<div>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"24px",flexWrap:"wrap",gap:"12px"}}>
<div><h1 style={{fontSize:"28px",fontWeight:"700",margin:0}}>Welcome, {u.name}</h1>
<div style={{display:"flex",alignItems:"center",gap:"8px",marginTop:"8px",flexWrap:"wrap"}}>
<p style={{fontSize:"36px",fontWeight:"700",margin:0}}><span style={{background:"linear-gradient(135deg,#d4af37,#f0d060)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{cv(tot)}</span></p>
<select value={dC} onChange={e=>setDC(e.target.value)} style={{padding:"4px 10px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"6px",color:"#d4af37",fontSize:"13px",fontWeight:"600",outline:"none",cursor:"pointer"}}>{ALL_C.map(x=><option key={x} value={x}>{x}</option>)}</select>
<span style={{color:"#6b7280",fontSize:"14px"}}>total</span>
</div></div>
<div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
<Link href="/wallet/deposit" style={{padding:"10px 24px",background:"linear-gradient(135deg,#d4af37,#b8942e)",color:"#000",fontWeight:"600",fontSize:"13px",borderRadius:"10px",textDecoration:"none"}}>📥 Deposit</Link>
<Link href="/wallet/withdraw" style={{padding:"10px 24px",background:"rgba(255,255,255,0.05)",color:"#e5e7eb",fontWeight:"500",fontSize:"13px",borderRadius:"10px",textDecoration:"none",border:"1px solid rgba(255,255,255,0.08)"}}>📤 Withdraw</Link>
<Link href="/wallet/swap" style={{padding:"10px 24px",background:"rgba(255,255,255,0.05)",color:"#e5e7eb",fontWeight:"500",fontSize:"13px",borderRadius:"10px",textDecoration:"none",border:"1px solid rgba(255,255,255,0.08)"}}>🔄 Swap</Link>
<Link href="/kyc" style={{padding:"8px 16px",background:"rgba(255,255,255,0.05)",color:"#e5e7eb",fontSize:"12px",borderRadius:"8px",textDecoration:"none",border:"1px solid rgba(255,255,255,0.08)"}}>📋 KYC</Link>
</div></div>
<div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"16px",padding:"24px",marginBottom:"24px"}}>
<h3 style={{fontSize:"16px",fontWeight:"600",marginBottom:"16px"}}>🪙 Crypto <span style={{color:"#6b7280",fontSize:"12px",fontWeight:"400"}}>Live prices</span></h3>
{c.length===0?<p style={{color:"#6b7280",fontSize:"13px"}}>No crypto yet</p>:c.map((b:any)=>(<div key={b.symbol} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
<div><span style={{fontWeight:"500",color:cc[b.symbol]||"#fff"}}>{b.symbol}</span><span style={{marginLeft:"8px"}}>{b.amount.toLocaleString("en-US",{minimumFractionDigits:4})}</span><span style={{color:"#6b7280",fontSize:"11px",marginLeft:"6px"}}>@ ${b.price?.toLocaleString()||"..."}</span></div>
<span style={{background:"linear-gradient(135deg,#d4af37,#f0d060)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{cv(b.usdValue)}</span>
</div>))}
</div>
<div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"16px",padding:"24px",marginBottom:"24px"}}>
<h3 style={{fontSize:"16px",fontWeight:"600",marginBottom:"16px"}}>📤 Send</h3>
{sM&&<div style={{background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.15)",color:"#22c55e",fontSize:"12px",padding:"10px",borderRadius:"8px",marginBottom:"12px"}}>{sM}</div>}
{sE&&<div style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.15)",color:"#ef4444",fontSize:"12px",padding:"10px",borderRadius:"8px",marginBottom:"12px"}}>{sE}</div>}
<form onSubmit={sf} style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
<input type="text" value={to} onChange={e=>setTo(e.target.value)} placeholder="Email/Username" style={{flex:1,minWidth:"180px",padding:"12px 14px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"10px",color:"#fff",fontSize:"14px",outline:"none"}} required/>
<input type="number" step="0.01" min="0.01" value={sA} onChange={e=>setSA(e.target.value)} placeholder="Amount" style={{width:"110px",padding:"12px 14px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"10px",color:"#fff",fontSize:"14px",outline:"none"}} required/>
<select value={sC} onChange={e=>setSC(e.target.value)} style={{width:"80px",padding:"12px 14px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"10px",color:"#fff",fontSize:"14px",outline:"none"}}><option>USD</option><option>EUR</option><option>GBP</option><option>USDT</option><option>BTC</option><option>ETH</option><option>SOL</option></select>
<button type="submit" style={{padding:"12px 24px",background:"linear-gradient(135deg,#d4af37,#b8942e)",color:"#000",fontWeight:"600",fontSize:"14px",border:"none",borderRadius:"10px",cursor:"pointer"}}>Send</button>
</form></div>
<div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"16px",padding:"24px"}}>
<h3 style={{fontSize:"16px",fontWeight:"600",marginBottom:"16px"}}>📋 Transactions</h3>
{tx.length===0?<p style={{color:"#6b7280",textAlign:"center",padding:"20px",fontSize:"13px"}}>No transactions</p>:tx.slice(0,25).map((x:any)=>(<div key={x.id} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
<div><span style={{fontSize:"13px",fontWeight:"500"}}>{x.type==="ADMIN_FUNDING"?"Deposited":x.type==="TRANSFER"?"Sent":x.type}</span>{x.description&&<p style={{fontSize:"11px",color:"#6b7280"}}>{x.description}</p>}</div>
<div style={{textAlign:"right"}}><span style={{fontSize:"13px",fontWeight:"500",color:"#22c55e"}}>+{Number(x.amount).toLocaleString("en-US",{minimumFractionDigits:2})} {x.currency}</span><p style={{fontSize:"11px",color:"#4b5563"}}>{new Date(x.createdAt).toLocaleDateString()}</p></div>
</div>))}</div></div>}

{t==="profile"&&<div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"16px",padding:"32px",maxWidth:"480px"}}>
<h2 style={{fontSize:"24px",fontWeight:"700",marginBottom:"24px"}}>👤 Profile</h2>
{[{l:"Name",v:u.name},{l:"Username",v:"@"+u.username,c:"#d4af37"},{l:"Email",v:u.email},{l:"KYC",v:kyc,c:kyc==="VERIFIED"?"#22c55e":kyc==="PENDING"?"#facc15":"#ef4444"}].map(i=>(
<div key={i.l} style={{marginBottom:"16px"}}><label style={{fontSize:"12px",color:"#6b7280",display:"block",marginBottom:"4px"}}>{i.l}</label><div style={{padding:"12px 16px",background:"rgba(255,255,255,0.04)",borderRadius:"10px",fontSize:"14px",color:i.c||"#fff"}}>{i.v}</div></div>))}</div>}

{t==="refer"&&<div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"16px",padding:"32px",maxWidth:"480px"}}>
<h2 style={{fontSize:"24px",fontWeight:"700",marginBottom:"24px"}}>🔗 Referral</h2>
<div style={{background:"rgba(212,175,55,0.06)",border:"1px solid rgba(212,175,55,0.15)",borderRadius:"12px",padding:"24px",textAlign:"center",marginBottom:"20px"}}>
<p style={{fontSize:"12px",color:"#6b7280",marginBottom:"8px"}}>Your Code</p>
<p style={{fontSize:"32px",fontWeight:"700",fontFamily:"Georgia,serif",background:"linear-gradient(135deg,#d4af37,#f0d060)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{rC}</p>
</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
<div className="stat"><div className="stat-value" style={{color:"#60a5fa"}}>0</div><div className="stat-label">Referrals</div></div>
<div className="stat"><div className="stat-value" style={{color:"#22c55e"}}>$0</div><div className="stat-label">Earned</div></div></div></div>}

{t==="settings"&&<div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"16px",padding:"32px",maxWidth:"480px"}}>
<h2 style={{fontSize:"24px",fontWeight:"700",marginBottom:"24px"}}>⚙️ Settings</h2>
{pM&&<div style={{background:pM.includes("✅")?"rgba(34,197,94,0.1)":"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.15)",color:pM.includes("✅")?"#22c55e":"#ef4444",fontSize:"12px",padding:"10px",borderRadius:"8px",marginBottom:"16px"}}>{pM}</div>}
<form onSubmit={cpw} style={{display:"flex",flexDirection:"column",gap:"12px"}}>
<input type="password" value={cP} onChange={e=>setCP(e.target.value)} placeholder="Current password" style={{width:"100%",padding:"12px 14px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"10px",color:"#fff",fontSize:"14px",outline:"none"}} required/>
<input type="password" value={nP} onChange={e=>setNP(e.target.value)} placeholder="New password" style={{width:"100%",padding:"12px 14px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"10px",color:"#fff",fontSize:"14px",outline:"none"}} required/>
<button type="submit" style={{padding:"12px",background:"linear-gradient(135deg,#d4af37,#b8942e)",color:"#000",fontWeight:"600",fontSize:"14px",border:"none",borderRadius:"10px",cursor:"pointer"}}>Change</button>
</form></div>}
</div></div>);}
DASH

git add -A && git commit -m "Master fix" && git push
echo "✅ Done!"
