"use client";import{useState}from"react";import Link from "next/link";
const A={"BTC":"14J6KfQzXyLV8gLUKMWch2S3hjJvkMy5Rc","USDT-ERC20":"0xa7b97439665f545adb3bbc431ceb5053d4b46f49","USDT-BEP20":"0xa7b97439665f545adb3bbc431ceb5053d4b46f49","USDT-TRC20":"TLgjfeg8Mqw5ueo1CGC8eTb4EHysPMMA6S","SOL":"FQy4HArVdBbZ87AHrbfdhSXRgyE5NUbrh6GaL8enMUeh","ETH":"0x09B0E6D01fb1DeDf172933cC1673aAf460353AAD"}
export default function Page(){const[as,setAs]=useState("BTC");const[st,setSt]=useState<"form"|"done">("form")
if(st==="done")return(<div className="app" style={{alignItems:"center",justifyContent:"center",padding:20}}><div className="card" style={{padding:32,maxWidth:440,width:"100%",textAlign:"center"}}>
<div style={{fontSize:48,marginBottom:12}}>📥</div><h2 className="font-serif" style={{fontSize:20,fontWeight:700,marginBottom:16}}>Deposit {as}</h2>
<div style={{background:"rgba(255,215,0,0.06)",border:"1px solid rgba(255,215,0,0.15)",borderRadius:12,padding:16,marginBottom:16,wordBreak:"break-all",fontSize:12,fontFamily:"monospace",color:"#FFD700"}}>{A[as]||"N/A"}</div>
<div className="br" style={{marginBottom:16}}>⚠️ Send only {as} to this address</div>
<p style={{color:"#facc15",fontSize:12,marginBottom:16}}>⏳ Notify admin after sending</p>
<Link href="/dashboard" className="btn btn-p">Dashboard</Link></div></div>)
return(<div className="app" style={{padding:"24px 4%"}}><div style={{maxWidth:500,margin:"0 auto"}}>
<Link href="/dashboard" className="muted" style={{fontSize:13,textDecoration:"none"}}>← Dashboard</Link>
<h1 className="font-serif" style={{fontSize:24,fontWeight:700,margin:"16px 0 24px"}}>📥 Deposit</h1>
<div className="card" style={{padding:24}}>
<label className="muted text-xs">Select Asset</label>
<select value={as} onChange={e=>setAs(e.target.value)} className="inp" style={{margin:"8px 0 20px"}}><option>BTC</option><option>ETH</option><option>SOL</option><option>USDT</option></select>
<button onClick={()=>setSt("done")} className="btn btn-p" style={{width:"100%"}}>Get Address</button>
</div></div></div>)}
