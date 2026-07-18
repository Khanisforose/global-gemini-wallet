"use client";import{useState}from"react";
export default function Home(){const[pg,setPg]=useState("home");const[lg,setLg]=useState(true);const[em,setEm]=useState("");const[pw,setPw]=useState("");const[nm,setNm]=useState("");const[us,setUs]=useState("");const[ph,setPh]=useState("");const[cy,setCy]=useState("");const[er,setEr]=useState("");const[msg,setMsg]=useState("");const[ld,setLd]=useState(false);const[se,setSe]=useState("")
const hL=async(e:any)=>{e.preventDefault();setEr("");setLd(true);try{const r=await fetch("/api/auth/signin",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:em,password:pw})});const d=await r.json();if(!r.ok)throw new Error(d.error);window.location.href=d.user.role==="ADMIN"?"/admin":"/dashboard"}catch(e:any){setEr(e.message)}finally{setLd(false)}}
const hR=async(e:any)=>{e.preventDefault();setEr("");setLd(true);try{const r=await fetch("/api/auth/signup",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:se,username:us,name:nm,password:pw,country:cy,phone:ph})});const d=await r.json();if(!r.ok)throw new Error(d.error);setMsg("✅ Account created! Please sign in.");setLg(true);setEm(se);setPw("")}catch(e:any){setEr(e.message)}finally{setLd(false)}}
const nav=[{k:"home",l:"Home"},{k:"features",l:"Features"},{k:"currencies",l:"Currencies"},{k:"about",l:"About"}]
const IP={width:"100%",padding:"14px 18px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"12px",color:"#fff",fontSize:"14px",outline:"none",boxSizing:"border-box"as const}
return(<div style={{minHeight:"100vh",background:"#050505",color:"#fff",fontFamily:"Inter,sans-serif"}}>
<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 4%",borderBottom:"1px solid rgba(255,255,255,0.05)",backdropFilter:"blur(24px)",background:"rgba(5,5,5,0.85)",position:"sticky",top:0,zIndex:100}}>
<span style={{fontWeight:700,fontSize:18}}>🌍 Global Gemini <span className="text-g">Wallet</span></span>
<div style={{display:"flex",gap:24,alignItems:"center"}}>{nav.map(n=>(<button key={n.k} onClick={()=>setPg(n.k)} style={{fontSize:14,color:pg===n.k?"#FFD700":"#9ca3af",background:"none",border:"none",cursor:"pointer",fontWeight:pg===n.k?600:400}}>{n.l}</button>))}
<button onClick={()=>{setPg("home");setLg(true)}} className="btn btn-s btn-sm">Sign In</button>
<button onClick={()=>{setPg("home");setLg(false)}} className="btn btn-p btn-sm">Get Started</button>
</div></div>

{pg==="home"&&<div style={{display:"flex",minHeight:"calc(100vh - 70px)"}}>
<div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"60px 4%",background:"radial-gradient(ellipse at 30% 50%,rgba(255,215,0,0.04) 0%,transparent 60%)"}}>
<div style={{maxWidth:540}}>
<div style={{display:"inline-flex",padding:"6px 16px",background:"rgba(255,215,0,0.1)",border:"1px solid rgba(255,215,0,0.15)",borderRadius:100,fontSize:12,color:"#FFD700",marginBottom:24}}>✦ Premium Multi-Currency Platform</div>
<h1 className="font-serif" style={{fontSize:56,fontWeight:700,lineHeight:"1.1",marginBottom:16}}>Your Global<br/><span className="text-g">Financial Command Center</span></h1>
<p style={{fontSize:15,color:"#6b7280",lineHeight:"1.8",marginBottom:32}}>Manage 170+ currencies, exchange at live rates, send money globally, and track your portfolio — all from one premium platform.</p>
<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:32}}>
{[{v:"170+",l:"Currencies"},{v:"10+",l:"Payment Methods"},{v:"100%",l:"Secure"},{v:"24/7",l:"Support"}].map(s=>(<div key={s.l} style={{padding:16,background:"rgba(255,255,255,0.03)",borderRadius:12,textAlign:"center"}}><div style={{fontSize:22,fontWeight:700}}><span className="text-g">{s.v}</span></div><div style={{fontSize:11,color:"#6b7280",marginTop:4}}>{s.l}</div></div>))}
</div>
<div style={{display:"flex",gap:16,fontSize:13}}>
<span style={{display:"flex",alignItems:"center",gap:6}}><span style={{color:"#22c55e"}}>✓</span> KYC Verified</span>
<span style={{display:"flex",alignItems:"center",gap:6}}><span style={{color:"#22c55e"}}>✓</span> Live Rates</span>
<span style={{display:"flex",alignItems:"center",gap:6}}><span style={{color:"#22c55e"}}>✓</span> Premium Security</span>
</div></div></div>
<div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"60px 4%"}}>
<div style={{width:"100%",maxWidth:420}}>
<div style={{display:"flex",marginBottom:24,gap:12}}>
<button onClick={()=>{setLg(true);setEr("");setMsg("")}} style={{flex:1,padding:12,borderRadius:12,border:"none",background:lg?"linear-gradient(135deg,#FFD700,#C9A227)":"rgba(255,255,255,0.05)",color:lg?"#000":"#fff",fontSize:14,fontWeight:600,cursor:"pointer"}}>🔐 Sign In</button>
<button onClick={()=>{setLg(false);setEr("");setMsg("")}} style={{flex:1,padding:12,borderRadius:12,border:"none",background:!lg?"linear-gradient(135deg,#FFD700,#C9A227)":"rgba(255,255,255,0.05)",color:!lg?"#000":"#fff",fontSize:14,fontWeight:600,cursor:"pointer"}}>✨ Register</button>
</div>
{er&&<div className="br">{er}</div>}{msg&&<div className="bg">{msg}</div>}
{lg?(<form onSubmit={hL} style={{display:"flex",flexDirection:"column",gap:14}}>
<input type="text" value={em} onChange={e=>setEm(e.target.value)} placeholder="Email or Username" style={IP} required/>
<input type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="Password" style={IP} required/>
<button type="submit" disabled={ld} className="btn btn-p" style={{width:"100%",padding:14,fontSize:15}}>{ld?"...":"🔐 Sign In"}</button>
</form>):(<form onSubmit={hR} style={{display:"flex",flexDirection:"column",gap:12}}>
<input type="text" value={nm} onChange={e=>setNm(e.target.value)} placeholder="Full Name" style={IP} required/>
<input type="text" value={us} onChange={e=>setUs(e.target.value)} placeholder="Username" style={IP} required/>
<input type="email" value={se} onChange={e=>setSe(e.target.value)} placeholder="Email" style={IP} required/>
<input type="tel" value={ph} onChange={e=>setPh(e.target.value)} placeholder="Phone Number" style={IP}/>
<input type="text" value={cy} onChange={e=>setCy(e.target.value)} placeholder="Country" style={IP}/>
<input type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="Password" style={IP} required/>
<button type="submit" disabled={ld} className="btn btn-p" style={{width:"100%",padding:14,fontSize:15}}>{ld?"...":"✨ Create Account"}</button>
</form>)}
</div></div></div>}

{pg==="features"&&<div style={{padding:"60px 4%",maxWidth:1000,margin:"0 auto",textAlign:"center"}}>
<h2 className="font-serif" style={{fontSize:36,fontWeight:700,marginBottom:12}}>Premium <span className="text-g">Features</span></h2>
<p className="muted" style={{fontSize:14,marginBottom:40}}>Everything you need to manage your wealth</p>
<div className="g3">{[
{i:"💱",t:"Multi-Currency",d:"10 wallets per user: USD, EUR, GBP, INR, AED, SAR, JPY, CNY, AUD, CAD. All with live exchange rates."},
{i:"🔄",t:"Instant Exchange",d:"Swap between any currencies at live rates. No hidden fees, instant settlement."},
{i:"📤",t:"Global Transfers",d:"Send money to any user instantly. Internal transfers with zero fees."},
{i:"📥",t:"Deposit Methods",d:"Fund via UPI, Bank Transfer, PayPal, Stripe, or Crypto from external wallets."},
{i:"📋",t:"KYC Verification",d:"Secure document upload and verification. Unlock full platform features."},
{i:"🔐",t:"Premium Security",d:"Bank-grade encryption, role-based access, audit logging, and 24/7 monitoring."},
].map(s=>(<div key={s.t} className="card" style={{padding:28,textAlign:"left"}}><div style={{fontSize:36,marginBottom:12}}>{s.i}</div><h3 style={{fontSize:16,fontWeight:600,marginBottom:8}}>{s.t}</h3><p className="muted" style={{fontSize:13,lineHeight:1.7}}>{s.d}</p></div>))}</div></div>}

{pg==="currencies"&&<div style={{padding:"60px 4%",maxWidth:800,margin:"0 auto",textAlign:"center"}}>
<h2 className="font-serif" style={{fontSize:36,fontWeight:700,marginBottom:12}}>Supported <span className="text-g">Currencies</span></h2>
<p className="muted" style={{fontSize:14,marginBottom:40}}>All major world currencies + cryptocurrencies</p>
<div className="g-auto">{["USD","EUR","GBP","INR","AED","SAR","JPY","CNY","AUD","CAD","USDT","BTC","ETH","SOL","BNB"].map(c=>(
<div key={c} className="card" style={{padding:20,textAlign:"center"}}><div style={{fontSize:18,fontWeight:700}}><span className="text-g">{c}</span></div></div>))}</div></div>}

{pg==="about"&&<div style={{padding:"60px 4%",maxWidth:700,margin:"0 auto"}}>
<h2 className="font-serif" style={{fontSize:36,fontWeight:700,marginBottom:20,textAlign:"center"}}>About <span className="text-g">Us</span></h2>
<div className="card" style={{padding:32,lineHeight:1.9,color:"#9ca3af",fontSize:14}}>
<p style={{marginBottom:16}}>Global Gemini Wallet is a premium multi-currency wealth management platform built for the modern world. We combine traditional fiat currencies with digital assets in one seamless, luxurious interface.</p>
<p>With KYC verification, encrypted authentication, admin oversight, and full audit trails, your funds and data remain secure at all times.</p>
</div>
<div className="g4" style={{marginTop:24}}>{[{v:"2025",l:"Founded"},{v:"170+",l:"Currencies"},{v:"100%",l:"Secure"},{v:"24/7",l:"Support"}].map(s=>(<div key={s.l} className="st"><div className="st-v"><span className="text-g">{s.v}</span></div><div className="st-l">{s.l}</div></div>))}</div></div>}
<div style={{borderTop:"1px solid rgba(255,255,255,0.05)",padding:"24px 4%",textAlign:"center",fontSize:12,color:"#4b5563"}}>© 2025 Global Gemini Wallet. All rights reserved.</div>
</div>)}
