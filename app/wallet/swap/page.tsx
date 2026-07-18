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
