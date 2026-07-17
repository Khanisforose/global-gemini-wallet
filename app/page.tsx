"use client"; import { useState } from "react";
export default function HomePage() {
  const [page, setPage] = useState("home");
  const [tab, setTab] = useState<"login"|"signup">("login");
  const [email, setE] = useState(""); const [pass, setP] = useState(""); const [name, setN] = useState(""); const [user, setUser] = useState(""); const [err, setErr] = useState(""); const [msg, setMsg] = useState(""); const [load, setL] = useState(false);
  const [signupEmail, setSE] = useState("");

  async function handleLogin(e: any) { e.preventDefault(); setErr(""); setL(true); try { const r=await fetch("/api/auth/signin",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password:pass})}); const d=await r.json(); if(!r.ok) throw new Error(d.error); window.location.href = d.user.role==="ADMIN"?"/admin":"/dashboard"; } catch(e:any) { setErr(e.message); } finally { setL(false); } }
  async function handleSignup(e: any) { e.preventDefault(); if(pass.length<6){setErr("Password min 6 chars");return} setErr(""); setL(true); try { const r=await fetch("/api/auth/signup",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:signupEmail,username:user,name,password:pass})}); const d=await r.json(); if(!r.ok) throw new Error(d.error); setMsg("✅ Account created! Please sign in."); setTab("login"); setE(signupEmail); setP(""); } catch(e:any) { setErr(e.message); } finally { setL(false); } }

  const IP = {width:"100%",padding:"12px 14px",background:"#1a1a2e",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"10px",color:"#fff",fontSize:"14px",outline:"none",boxSizing:"border-box"as const};
  const BTN = {width:"100%",padding:"12px",background:"linear-gradient(135deg,#d4af37,#b8942e)",color:"#000",fontWeight:"600",fontSize:"14px",border:"none",borderRadius:"10px",cursor:"pointer",opacity:load?0.5:1};

  return (
    <div style={{minHeight:"100vh",background:"#0a0a0f",color:"#fff",fontFamily:"Inter,sans-serif"}}>
      {/* Navigation */}
      <div style={{borderBottom:"1px solid rgba(255,255,255,0.06)",padding:"14px 32px",display:"flex",alignItems:"center",justifyContent:"space-between",maxWidth:"1200px",margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
          <span style={{fontSize:"20px"}}>🌍</span>
          <span style={{fontFamily:"Georgia,serif",fontSize:"18px",fontWeight:"700"}}>Global Gemini <span style={{background:"linear-gradient(135deg,#d4af37,#f0d060)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Wallet</span></span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"20px"}}>
          {["home","services","earn","about"].map(p=>(
            <button key={p} onClick={()=>setPage(p)} style={{fontSize:"13px",color:page===p?"#d4af37":"#9ca3af",background:"none",border:"none",cursor:"pointer",textTransform:"capitalize",fontWeight:page===p?"600":"400"}}>{p==="home"?"Home":p==="services"?"Services":p==="earn"?"Join & Earn":"About"}</button>
          ))}
        </div>
        <div style={{display:"flex",gap:"8px"}}>
          <button onClick={()=>{setPage("home");setTab("login")}} style={{padding:"8px 20px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"8px",color:"#fff",fontSize:"12px",cursor:"pointer"}}>Sign In</button>
          <button onClick={()=>{setPage("home");setTab("signup")}} style={{padding:"8px 20px",background:"linear-gradient(135deg,#d4af37,#b8942e)",border:"none",borderRadius:"8px",color:"#000",fontWeight:"600",fontSize:"12px",cursor:"pointer"}}>Get Started</button>
        </div>
      </div>

      {page==="home" && (
        <div style={{maxWidth:"1200px",margin:"0 auto",padding:"40px 32px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"60px",alignItems:"center"}}>
          <div>
            <div style={{display:"inline-flex",padding:"6px 16px",background:"rgba(212,175,55,0.1)",border:"1px solid rgba(212,175,55,0.15)",borderRadius:"100px",color:"#d4af37",fontSize:"12px",marginBottom:"20px"}}>✦ Multi-Currency Platform</div>
            <h1 style={{fontSize:"48px",fontWeight:"bold",fontFamily:"Georgia,serif",lineHeight:"1.1",marginBottom:"16px"}}>Your Global<br/><span style={{background:"linear-gradient(135deg,#d4af37,#f0d060)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Financial Hub</span></h1>
            <p style={{color:"#9ca3af",fontSize:"15px",lineHeight:"1.7",marginBottom:"24px"}}>Manage fiat & crypto in one place. Send funds, track live prices, deposit via UPI/Bank/PayPal/Crypto, and grow your wealth securely.</p>
            <div style={{display:"flex",gap:"12px",marginBottom:"32px"}}>
              <button onClick={()=>setTab("signup")} style={{padding:"14px 32px",background:"linear-gradient(135deg,#d4af37,#b8942e)",border:"none",borderRadius:"12px",color:"#000",fontWeight:"600",fontSize:"14px",cursor:"pointer"}}>Create Free Account</button>
              <button onClick={()=>setTab("login")} style={{padding:"14px 32px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"12px",color:"#fff",fontSize:"14px",cursor:"pointer"}}>Sign In</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"16px"}}>
              {[{v:"170+",l:"Currencies"},{v:"100%",l:"Secure"},{v:"0 Fees",l:"Management"}].map(s=><div key={s.l} style={{textAlign:"center",padding:"12px",background:"rgba(255,255,255,0.03)",borderRadius:"10px"}}><div style={{fontSize:"24px",fontWeight:"bold",background:"linear-gradient(135deg,#d4af37,#f0d060)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{s.v}</div><div style={{fontSize:"11px",color:"#6b7280",marginTop:"4px"}}>{s.l}</div></div>)}
            </div>
          </div>
          {/* Auth Card */}
          <div style={{background:"rgba(255,255,255,0.03)",backdropFilter:"blur(24px)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"16px",overflow:"hidden"}}>
            <div style={{display:"flex",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
              <button onClick={()=>{setTab("login");setErr("");setMsg("")}} style={{flex:1,padding:"14px",fontSize:"14px",fontWeight:"500",background:tab==="login"?"rgba(212,175,55,0.08)":"transparent",border:"none",borderBottom:tab==="login"?"2px solid #d4af37":"2px solid transparent",color:tab==="login"?"#d4af37":"#6b7280",cursor:"pointer"}}>🔐 Sign In</button>
              <button onClick={()=>{setTab("signup");setErr("");setMsg("")}} style={{flex:1,padding:"14px",fontSize:"14px",fontWeight:"500",background:tab==="signup"?"rgba(212,175,55,0.08)":"transparent",border:"none",borderBottom:tab==="signup"?"2px solid #d4af37":"2px solid transparent",color:tab==="signup"?"#d4af37":"#6b7280",cursor:"pointer"}}>✨ Sign Up</button>
            </div>
            <div style={{padding:"28px"}}>
              {err && <div style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.15)",color:"#ef4444",fontSize:"12px",padding:"10px",borderRadius:"8px",marginBottom:"12px"}}>{err}</div>}
              {msg && <div style={{background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.15)",color:"#22c55e",fontSize:"12px",padding:"10px",borderRadius:"8px",marginBottom:"12px"}}>{msg}</div>}
              {tab==="login" ? (
                <form onSubmit={handleLogin} style={{display:"flex",flexDirection:"column",gap:"14px"}}>
                  <input type="text" value={email} onChange={e=>setE(e.target.value)} placeholder="Email or Username" style={IP} required />
                  <input type="password" value={pass} onChange={e=>setP(e.target.value)} placeholder="Password" style={IP} required />
                  <button type="submit" disabled={load} style={BTN}>{load?"Signing in...":"🔐 Sign In"}</button>
                </form>
              ) : (
                <form onSubmit={handleSignup} style={{display:"flex",flexDirection:"column",gap:"14px"}}>
                  <input type="text" value={name} onChange={e=>setN(e.target.value)} placeholder="Full Name" style={IP} required />
                  <input type="text" value={user} onChange={e=>setUser(e.target.value)} placeholder="Username" style={IP} required />
                  <input type="email" value={signupEmail} onChange={e=>setSE(e.target.value)} placeholder="Email" style={IP} required />
                  <input type="password" value={pass} onChange={e=>setP(e.target.value)} placeholder="Password (min 6 chars)" style={IP} required />
                  <button type="submit" disabled={load} style={BTN}>{load?"Creating...":"✨ Create Free Account"}</button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {page==="services" && (
        <div style={{maxWidth:"1000px",margin:"0 auto",padding:"60px 32px",textAlign:"center"}}>
          <h2 style={{fontSize:"32px",fontWeight:"bold",fontFamily:"Georgia,serif",marginBottom:"12px"}}>Our <span className="gold-text">Services</span></h2>
          <p style={{color:"#9ca3af",fontSize:"14px",marginBottom:"40px"}}>Everything you need to manage your wealth</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:"20px"}}>
            {[{i:"💱",t:"Multi-Currency",d:"170+ fiat currencies with live exchange rates"},{i:"🪙",t:"Crypto Wallet",d:"BTC, ETH, SOL, USDT with real-time prices"},{i:"📤",t:"Send & Receive",d:"Transfer funds to any user by email or username"},{i:"📥",t:"Deposit Methods",d:"UPI, Bank Transfer, PayPal, Crypto networks"},{i:"📋",t:"KYC Verified",d:"Secure identity verification for compliance"},{i:"🔐",t:"Bank Grade Security",d:"Encrypted transactions and secure storage"}].map(s=><div key={s.t} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"16px",padding:"24px",textAlign:"center"}}><div style={{fontSize:"36px",marginBottom:"12px"}}>{s.i}</div><h3 style={{fontSize:"16px",fontWeight:"600",marginBottom:"8px"}}>{s.t}</h3><p style={{fontSize:"13px",color:"#6b7280",lineHeight:"1.5"}}>{s.d}</p></div>)}
          </div>
        </div>
      )}

      {page==="earn" && (
        <div style={{maxWidth:"800px",margin:"0 auto",padding:"60px 32px",textAlign:"center"}}>
          <h2 style={{fontSize:"32px",fontWeight:"bold",fontFamily:"Georgia,serif",marginBottom:"12px"}}>Join & <span className="gold-text">Earn</span></h2>
          <p style={{color:"#9ca3af",fontSize:"14px",marginBottom:"40px"}}>Refer friends and earn rewards</p>
          <div style={{background:"rgba(212,175,55,0.06)",border:"1px solid rgba(212,175,55,0.12)",borderRadius:"16px",padding:"40px",maxWidth:"400px",margin:"0 auto"}}>
            <div style={{fontSize:"48px",marginBottom:"16px"}}>🔗</div>
            <h3 style={{fontSize:"20px",fontWeight:"bold",marginBottom:"12px"}}>Referral Program</h3>
            <p style={{color:"#9ca3af",fontSize:"13px",marginBottom:"20px",lineHeight:"1.6"}}>Share your unique referral code with friends. You earn <strong style={{color:"#d4af37"}}>5%</strong> of their first deposit!</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
              <div style={{background:"rgba(255,255,255,0.05)",borderRadius:"12px",padding:"16px"}}><div style={{fontSize:"24px",fontWeight:"bold",color:"#60a5fa"}}>Unlimited</div><div style={{fontSize:"11px",color:"#6b7280",marginTop:"4px"}}>Referrals</div></div>
              <div style={{background:"rgba(255,255,255,0.05)",borderRadius:"12px",padding:"16px"}}><div style={{fontSize:"24px",fontWeight:"bold",color:"#22c55e"}}>5%</div><div style={{fontSize:"11px",color:"#6b7280",marginTop:"4px"}}>Commission</div></div>
            </div>
          </div>
        </div>
      )}

      {page==="about" && (
        <div style={{maxWidth:"800px",margin:"0 auto",padding:"60px 32px"}}>
          <h2 style={{fontSize:"32px",fontWeight:"bold",fontFamily:"Georgia,serif",marginBottom:"20px",textAlign:"center"}}>About <span className="gold-text">Us</span></h2>
          <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"16px",padding:"32px",lineHeight:"1.8",color:"#9ca3af",fontSize:"14px"}}>
            <p style={{marginBottom:"16px"}}>Global Gemini Wallet is a multi-currency wealth management platform built for the modern world. We combine traditional fiat currencies with cryptocurrency in one seamless interface.</p>
            <p style={{marginBottom:"16px"}}>Our platform supports 170+ fiat currencies and major cryptocurrencies including Bitcoin, Ethereum, Solana, and USDT. All exchange rates update in real-time from live market data.</p>
            <p>Security is our priority. With KYC verification, encrypted transactions, and admin oversight, your funds are always protected.</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"16px",marginTop:"24px",textAlign:"center"}}>
            <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"12px",padding:"20px"}}><div style={{fontSize:"28px",fontWeight:"bold",color:"#d4af37"}}>2025</div><div style={{fontSize:"11px",color:"#6b7280",marginTop:"4px"}}>Founded</div></div>
            <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"12px",padding:"20px"}}><div style={{fontSize:"28px",fontWeight:"bold",color:"#d4af37"}}>170+</div><div style={{fontSize:"11px",color:"#6b7280",marginTop:"4px"}}>Currencies</div></div>
            <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"12px",padding:"20px"}}><div style={{fontSize:"28px",fontWeight:"bold",color:"#d4af37"}}>100%</div><div style={{fontSize:"11px",color:"#6b7280",marginTop:"4px"}}>Secure</div></div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{borderTop:"1px solid rgba(255,255,255,0.06)",padding:"24px 32px",textAlign:"center",fontSize:"12px",color:"#4b5563"}}>
        © 2025 Global Gemini Wallet. All rights reserved.
      </div>
    </div>
  );
}
