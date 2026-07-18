"use client";import{useState}from"react";import Link from "next/link";
const A:Record<string,string>={"BTC-Bitcoin":"14J6KfQzXyLV8gLUKMWch2S3hjJvkMy5Rc","USDT-ERC20":"0xa7b97439665f545adb3bbc431ceb5053d4b46f49","USDT-BEP20":"0xa7b97439665f545adb3bbc431ceb5053d4b46f49","USDT-TRC20":"TLgjfeg8Mqw5ueo1CGC8eTb4EHysPMMA6S","SOL-Solana":"FQy4HArVdBbZ87AHrbfdhSXRgyE5NUbrh6GaL8enMUeh","ETH-ERC20":"0x09B0E6D01fb1DeDf172933cC1673aAf460353AAD"}
export default function Page(){const[m,setM]=useState("CRYPTO");const[a,setA]=useState("USDT");const[n,setN]=useState("ERC20");const[s,setS]=useState<"form"|"done">("form")
const ads=[{s:"USDT",n:["ERC20","BEP20","TRC20"]},{s:"BTC",n:["Bitcoin"]},{s:"ETH",n:["ERC20"]},{s:"SOL",n:["Solana"]}]
const ca=ads.find(x=>x.s===a)
if(s==="done")return(<div className="min-h-screen" style={{background:"#0a0a0f",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}><div className="card" style={{padding:"32px",maxWidth:"440px",width:"100%",textAlign:"center"}}>
<div style={{fontSize:"48px",marginBottom:"12px"}}>📥</div><h2 style={{fontSize:"20px",fontWeight:"700",fontFamily:"Georgia,serif",marginBottom:"8px"}}>Deposit {a}</h2>
<p className="text-muted text-sm" style={{marginBottom:"16px"}}>Send to:</p>
<div style={{background:"rgba(212,175,55,0.06)",border:"1px solid rgba(212,175,55,0.15)",borderRadius:"10px",padding:"12px",marginBottom:"16px",wordBreak:"break-all",fontSize:"12px",fontFamily:"monospace",color:"#d4af37"}}>{(A as Record<string,string>)[a+"-"+n]||"N/A"}</div>
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
