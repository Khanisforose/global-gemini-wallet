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
