"use client";import{useState}from"react";import Link from "next/link";
export default function Page(){const[m,setM]=useState("UPI");const[c,setC]=useState("USD");const[a,setA]=useState("");const[d,setD]=useState<Record<string,string>>({});const[st,setSt]=useState<"form"|"done">("form")
if(st==="done")return(<div className="app" style={{alignItems:"center",justifyContent:"center",padding:20}}><div className="card" style={{padding:32,maxWidth:400,textAlign:"center"}}>
<div style={{fontSize:48,marginBottom:12}}>📤</div><h2 className="font-serif" style={{fontSize:20,fontWeight:700,marginBottom:12}}>Submitted</h2>
<p style={{color:"#facc15",fontSize:12,marginBottom:16}}>⏳ Pending approval</p>
<Link href="/dashboard" className="btn btn-p">Dashboard</Link></div></div>)
const mt=[{id:"UPI",f:[{k:"upi",pl:"UPI ID"}]},{id:"BANK",f:[{k:"name",pl:"Name"},{k:"acc",pl:"Account"},{k:"ifsc",pl:"IFSC"}]},{id:"PAYPAL",f:[{k:"em",pl:"Email"}]},{id:"CRYPTO",f:[{k:"addr",pl:"Address"},{k:"net",pl:"Network"}]}]
return(<div className="app" style={{padding:"24px 4%"}}><div style={{maxWidth:500,margin:"0 auto"}}>
<Link href="/dashboard" className="muted" style={{fontSize:13,textDecoration:"none"}}>← Dashboard</Link>
<h1 className="font-serif" style={{fontSize:24,fontWeight:700,margin:"16px 0 24px"}}>📤 Withdraw</h1>
<div className="card" style={{padding:24}}>
<div className="g-auto" style={{marginBottom:16,gap:8}}>{mt.map(x=>(<button key={x.id} onClick={()=>{setM(x.id);setD({})}} style={{padding:12,borderRadius:10,border:m===x.id?"2px solid #FFD700":"1px solid rgba(255,255,255,0.08)",background:m===x.id?"rgba(255,215,0,0.1)":"rgba(255,255,255,0.03)",color:"#fff",cursor:"pointer",fontSize:12,textAlign:"center"}}>{x.id}</button>))}</div>
<div style={{display:"flex",gap:8,marginBottom:16}}><select value={c} onChange={e=>setC(e.target.value)} className="inp" style={{width:100}}><option>USD</option><option>EUR</option><option>GBP</option><option>USDT</option></select>
<input type="number" step="0.01" value={a} onChange={e=>setA(e.target.value)} placeholder="Amount" className="inp" style={{flex:1}}/></div>
{mt.find(x=>x.id===m)?.f.map(x=>(<input key={x.k} type="text" value={d[x.k]||""} onChange={e=>setD({...d,[x.k]:e.target.value})} placeholder={x.pl} className="inp" style={{marginBottom:8}}/>))}
<button onClick={()=>setSt("done")} className="btn btn-p" style={{width:"100%",marginTop:8}}>Submit</button>
</div></div></div>)}
