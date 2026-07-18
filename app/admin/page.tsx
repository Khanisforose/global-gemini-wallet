"use client";import{useState,useEffect}from"react";import Link from "next/link";
export default function AdminPage(){
const[u,setU]=useState<any[]>([]);const[uid,setUid]=useState("");const[cr,setCr]=useState("USD");const[am,setAm]=useState("");const[msg,setMsg]=useState("");const[er,setEr]=useState("");const[sq,setSq]=useState("");const CC=["USD","EUR","GBP","INR","AED","SAR","JPY","CNY","AUD","CAD","USDT","BTC","ETH","SOL"]
useEffect(()=>{fetch("/api/auth/me").then(r=>r.json()).then(d=>{if(d.role!=="ADMIN"){window.location.href="/";return}load()})},[])
const load=()=>fetch("/api/admin/users").then(r=>r.json()).then(d=>setU(d.users||[]))
const fd=async()=>{setMsg("");setEr("");try{const r=await fetch("/api/admin/fund",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:uid,currency:cr,amount:parseFloat(am)})});const d=await r.json();if(!r.ok)throw new Error(d.error);setMsg("✅ Deposited!");setAm("")}catch(e:any){setEr(e.message)}}
const da=async(id:string,a:string)=>{await fetch("/api/admin/user",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:id,action:a})});load()}
const dl=async(id:string)=>{if(!confirm("Delete?"))return;await fetch("/api/admin/user",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:id})});load()}
const filtered=u.filter((x:any)=>x.name?.toLowerCase().includes(sq.toLowerCase())||x.email?.toLowerCase().includes(sq.toLowerCase()))
return(<div className="app"><div className="top"><div className="top-in">
<span style={{fontWeight:700,fontSize:18}}>🌍 Global Gemini <span className="text-g">Wallet</span><span style={{fontSize:10,background:"rgba(255,215,0,0.12)",color:"#FFD700",padding:"2px 8px",borderRadius:100,marginLeft:8}}>ADMIN</span></span>
<div style={{display:"flex",gap:16,alignItems:"center"}}>
<Link href="/admin" className="tab act">💫 Dashboard</Link>
<Link href="/admin/kyc" className="tab">📋 KYC</Link>
<Link href="/admin/deposits" className="tab">📥 Deposits</Link>
<Link href="/admin/withdrawals" className="tab">📤 Withdrawals</Link>
<button onClick={async()=>{await fetch("/api/auth/signout",{method:"POST"});window.location.href="/"}} className="btn btn-s btn-sm">Sign Out</button>
</div></div></div>
<div className="main fi">
<h1 style={{fontSize:26,fontWeight:700,marginBottom:24}}><span className="text-g">⚡ Admin Panel</span></h1>
<div className="g4" style={{marginBottom:24}}>
<div className="st"><div className="st-v" style={{color:"#60a5fa"}}>{u.length}</div><div className="st-l">Users</div></div>
<div className="st"><div className="st-v" style={{color:"#facc15"}}>{u.filter((x:any)=>x.kycStatus==="PENDING").length}</div><div className="st-l">KYC</div></div>
<div className="st"><div className="st-v" style={{color:"#22c55e"}}>{u.filter((x:any)=>x.kycStatus==="VERIFIED").length}</div><div className="st-l">Verified</div></div>
<div className="st"><div className="st-v" style={{color:"#a78bfa"}}>{u.filter((x:any)=>x.status==="ACTIVE").length}</div><div className="st-l">Active</div></div>
</div>
<div className="g2" style={{gap:24}}>
<div className="card" style={{padding:24}}>
<h3 style={{fontSize:16,fontWeight:600,marginBottom:16}}>💫 Fund User</h3>
{msg&&<div className="bg">{msg}</div>}{er&&<div className="br">{er}</div>}
<select value={uid} onChange={e=>setUid(e.target.value)} className="inp" style={{marginBottom:12}} required><option value="">Select user</option>{u.filter((x:any)=>x.role!=="ADMIN").map((x:any)=><option key={x.id} value={x.id}>{x.name} ({x.email})</option>)}</select>
<div style={{display:"flex",gap:8,marginBottom:12}}><select value={cr} onChange={e=>setCr(e.target.value)} className="inp" style={{width:100}}>{CC.map(c=><option key={c} value={c}>{c}</option>)}</select>
<input type="number" step="0.01" value={am} onChange={e=>setAm(e.target.value)} placeholder="Amount" className="inp" style={{flex:1}}/></div>
<button onClick={fd} className="btn btn-p" style={{width:"100%"}}>💫 Deposit</button>
</div>
<div className="card" style={{padding:24}}>
<h3 style={{fontSize:16,fontWeight:600,marginBottom:16}}>👥 Users</h3>
<input type="text" value={sq} onChange={e=>setSq(e.target.value)} placeholder="Search users..." className="inp" style={{marginBottom:12}}/>
<div style={{maxHeight:400,overflowY:"auto"}}>{filtered.map((x:any)=>(<div key={x.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
<div><span style={{fontSize:14,fontWeight:500}}>{x.name}</span><span className="muted text-xs" style={{marginLeft:6}}>{x.email}</span></div>
<div style={{display:"flex",gap:4,alignItems:"center"}}>
<span style={{fontSize:10,padding:"2px 6px",borderRadius:100,color:x.kycStatus==="VERIFIED"?"#22c55e":"#facc15",background:x.kycStatus==="VERIFIED"?"rgba(34,197,94,0.1)":"rgba(250,204,21,0.1)"}}>{x.kycStatus}</span>
{x.status==="FROZEN"?<button onClick={()=>da(x.id,"UNFREEZE")} className="btn btn-s" style={{padding:"3px 8px",fontSize:10}}>Unfreeze</button>:<button onClick={()=>da(x.id,"FREEZE")} className="btn btn-s" style={{padding:"3px 8px",fontSize:10}}>Freeze</button>}
<button onClick={()=>dl(x.id)} style={{padding:"3px 8px",background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:6,color:"#ef4444",fontSize:10,cursor:"pointer"}}>Delete</button>
</div></div>))}</div></div></div></div></div>)
