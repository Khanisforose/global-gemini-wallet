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
