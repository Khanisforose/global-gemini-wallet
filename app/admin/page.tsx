"use client";import{useState,useEffect}from"react";import Link from "next/link";
export default function AdminPage(){const[users,setU]=useState<any[]>([]);const[email,setE]=useState("");const[curr,setC]=useState("USD");const[amt,setA]=useState("");const[msg,setMsg]=useState("");const[err,setErr]=useState("");
const CC=["USD","EUR","GBP","JPY","CHF","CAD","AUD","CNY","INR","BRL","MXN","USDT","BTC","ETH","SOL"];
useEffect(()=>{fetch("/api/auth/me").then(r=>r.json()).then(d=>{if(d.role!=="ADMIN"){window.location.href="/";return}fetch("/api/admin/users").then(r=>r.json()).then(d=>setU(d.users||[]))})},[]);
const fd=async(e:any)=>{e.preventDefault();setMsg("");setErr("");try{const r=await fetch("/api/admin/fund",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,currency:curr,amount:parseFloat(amt)})});const d=await r.json();if(!r.ok)throw new Error(d.error);setMsg("✅ Deposited "+amt+" "+curr);setA("")}catch(e:any){setErr(e.message)}};
return(<div className="app"><header className="header"><div className="header-inner"><span className="font-display" style={{fontSize:"18px",fontWeight:"700"}}>🌍 Global Gemini <span className="text-gradient">Wallet</span> <span className="badge" style={{background:"rgba(212,175,55,0.1)",color:"#d4af37",marginLeft:"8px"}}>ADMIN</span></span>
<div className="row"><Link href="/admin" className="tab active" style={{fontSize:"13px"}}>💫 Dashboard</Link><Link href="/admin/kyc" className="tab" style={{fontSize:"13px"}}>📋 KYC</Link><Link href="/admin/deposits" className="tab" style={{fontSize:"13px"}}>📥 Deposits</Link><Link href="/admin/withdrawals" className="tab" style={{fontSize:"13px"}}>📤 Withdrawals</Link>
<button onClick={async()=>{await fetch("/api/auth/signout",{method:"POST"});window.location.href="/"}} className="btn btn-secondary btn-sm">Sign Out</button></div></div></header>
<main className="main"><div className="fade-in">
<h1 className="font-display" style={{fontSize:"28px",fontWeight:"700",marginBottom:"24px"}}><span className="text-gradient">⚡ Admin Panel</span></h1>
<div className="grid-2" style={{gap:"24px",marginBottom:"24px"}}>
<div className="stat"><div className="stat-value" style={{color:"#60a5fa"}}>{users.length}</div><div className="stat-label">Total Users</div></div>
<div className="stat"><div className="stat-value" style={{color:"#facc15"}}>{users.filter((u:any)=>u.kycStatus==="PENDING").length}</div><div className="stat-label">KYC Pending</div></div>
<div className="stat"><div className="stat-value" style={{color:"#22c55e"}}>{users.filter((u:any)=>u.kycStatus==="VERIFIED").length}</div><div className="stat-label">Verified</div></div>
<div className="stat"><div className="stat-value" style={{color:"#a78bfa"}}>{users.filter((u:any)=>u.role==="USER").length}</div><div className="stat-label">Active Users</div></div>
</div>
<div className="grid-2" style={{gap:"24px"}}>
<div className="card" style={{padding:"24px"}}><h3 className="font-display" style={{fontSize:"16px",fontWeight:"600",marginBottom:"16px"}}>💫 Deposit to User</h3>
{msg&&<div className="badge badge-green" style={{marginBottom:"12px",padding:"10px",borderRadius:"8px",display:"block"}}>{msg}</div>}
{err&&<div className="badge badge-red" style={{marginBottom:"12px",padding:"10px",borderRadius:"8px",display:"block"}}>{err}</div>}
<form onSubmit={fd} style={{display:"flex",flexDirection:"column",gap:"12px"}}>
<select value={email} onChange={e=>setE(e.target.value)} className="input" required><option value="">Select user...</option>{users.filter((u:any)=>u.role!=="ADMIN").map((u:any)=><option key={u.id} value={u.email}>{u.name} ({u.email})</option>)}</select>
<div className="row" style={{gap:"8px"}}><select value={curr} onChange={e=>setC(e.target.value)} className="input" style={{width:"100px"}}>{CC.map(c=><option key={c} value={c}>{c}</option>)}</select>
<input type="number" step="0.01" min="0.01" value={amt} onChange={e=>setA(e.target.value)} placeholder="Amount" className="input" style={{flex:1}} required/></div>
<button type="submit" className="btn btn-primary" style={{width:"100%"}}>💫 Deposit</button></form></div>
<div className="card" style={{padding:"24px"}}><h3 className="font-display" style={{fontSize:"16px",fontWeight:"600",marginBottom:"16px"}}>👥 Users</h3>
<div style={{maxHeight:"400px",overflowY:"auto"}}>{users.map((u:any)=>(<div key={u.id} className="row-between" style={{padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
<div><span style={{fontSize:"14px",fontWeight:"500"}}>{u.name}</span><span className="text-muted text-xs" style={{marginLeft:"6px"}}>{u.email}</span></div>
<div className="row" style={{gap:"6px"}}><span className={`badge ${u.kycStatus==="VERIFIED"?"badge-green":u.kycStatus==="PENDING"?"badge-red":"badge-red"}`}>{u.kycStatus}</span></div>
</div>))}</div></div></div></div></main></div>);}
