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
