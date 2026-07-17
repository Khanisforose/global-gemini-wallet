"use client"; import { useState } from "react";
export default function HomePage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setE] = useState(""); const [pass, setP] = useState(""); const [name, setN] = useState(""); const [user, setUser] = useState(""); const [err, setErr] = useState(""); const [msg, setMsg] = useState(""); const [load, setL] = useState(false);
  const [signupEmail, setSE] = useState("");

  async function handleLogin(e:any) { e.preventDefault(); setErr(""); setL(true); try { const r=await fetch("/api/auth/signin",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password:pass})}); const d=await r.json(); if(!r.ok) throw new Error(d.error); window.location.href = d.user.role==="ADMIN"?"/admin":"/dashboard"; } catch(e:any) { setErr(e.message); } finally { setL(false); } }
  async function handleSignup(e:any) { e.preventDefault(); if(pass.length<6){setErr("Password min 6 chars");return} setErr(""); setL(true); try { const r=await fetch("/api/auth/signup",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:signupEmail,username:user,name,password:pass})}); const d=await r.json(); if(!r.ok) throw new Error(d.error); setMsg("✅ Account created! Please sign in."); setIsLogin(true); setE(signupEmail); setP(""); } catch(e:any) { setErr(e.message); } finally { setL(false); } }

  return (
    <div style={{minHeight:"100vh",display:"flex",background:"#0a0a0f",color:"#fff",fontFamily:"Inter,sans-serif"}}>
      {/* LEFT - Brand Side */}
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"80px",background:"radial-gradient(ellipse at center,rgba(212,175,55,0.06) 0%,transparent 70%)"}}>
        <div style={{maxWidth:"520px"}}>
          <div style={{width:"56px",height:"56px",borderRadius:"14px",background:"linear-gradient(135deg,#d4af37,#b8942e)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"24px",fontWeight:"bold",color:"#000",marginBottom:"32px"}}>G</div>
          <h1 style={{fontSize:"56px",fontWeight:"800",fontFamily:"Georgia,serif",lineHeight:"1.1",marginBottom:"16px"}}>Global<br/><span style={{background:"linear-gradient(135deg,#d4af37,#f0d060)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Gemini Wallet</span></h1>
          <p style={{fontSize:"16px",color:"#6b7280",lineHeight:"1.7",marginBottom:"40px"}}>The most comprehensive multi-currency platform. Manage fiat, crypto, send funds, track live prices, and grow your wealth — all in one place.</p>
          
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"16px"}}>
            <div style={{padding:"16px",background:"rgba(255,255,255,0.03)",borderRadius:"12px",textAlign:"center"}}><div style={{fontSize:"24px",fontWeight:"700",background:"linear-gradient(135deg,#d4af37,#f0d060)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>170+</div><div style={{fontSize:"11px",color:"#6b7280",marginTop:"4px"}}>Fiat Currencies</div></div>
            <div style={{padding:"16px",background:"rgba(255,255,255,0.03)",borderRadius:"12px",textAlign:"center"}}><div style={{fontSize:"24px",fontWeight:"700",background:"linear-gradient(135deg,#d4af37,#f0d060)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>4</div><div style={{fontSize:"11px",color:"#6b7280",marginTop:"4px"}}>Cryptocurrencies</div></div>
            <div style={{padding:"16px",background:"rgba(255,255,255,0.03)",borderRadius:"12px",textAlign:"center"}}><div style={{fontSize:"24px",fontWeight:"700",background:"linear-gradient(135deg,#d4af37,#f0d060)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>5+</div><div style={{fontSize:"11px",color:"#6b7280",marginTop:"4px"}}>Payment Methods</div></div>
            <div style={{padding:"16px",background:"rgba(255,255,255,0.03)",borderRadius:"12px",textAlign:"center"}}><div style={{fontSize:"24px",fontWeight:"700",background:"linear-gradient(135deg,#d4af37,#f0d060)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>100%</div><div style={{fontSize:"11px",color:"#6b7280",marginTop:"4px"}}>Secure</div></div>
          </div>

          <div style={{marginTop:"40px",display:"flex",gap:"24px"}}>
            <div style={{display:"flex",alignItems:"center",gap:"8px",fontSize:"13px",color:"#6b7280"}}><span style={{color:"#22c55e"}}>✓</span> KYC Verified</div>
            <div style={{display:"flex",alignItems:"center",gap:"8px",fontSize:"13px",color:"#6b7280"}}><span style={{color:"#22c55e"}}>✓</span> Live Exchange Rates</div>
            <div style={{display:"flex",alignItems:"center",gap:"8px",fontSize:"13px",color:"#6b7280"}}><span style={{color:"#22c55e"}}>✓</span> Instant Transfers</div>
          </div>
        </div>
      </div>

      {/* RIGHT - Auth Side */}
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"80px"}}>
        <div style={{width:"100%",maxWidth:"420px"}}>
          <div style={{display:"flex",marginBottom:"32px",gap:"16px"}}>
            <button onClick={()=>{setIsLogin(true);setErr("");setMsg("")}} style={{padding:"10px 24px",borderRadius:"10px",border:"none",background:isLogin?"#d4af37":"rgba(255,255,255,0.05)",color:isLogin?"#000":"#fff",fontSize:"14px",fontWeight:"600",cursor:"pointer"}}>Sign In</button>
            <button onClick={()=>{setIsLogin(false);setErr("");setMsg("")}} style={{padding:"10px 24px",borderRadius:"10px",border:"none",background:!isLogin?"#d4af37":"rgba(255,255,255,0.05)",color:!isLogin?"#000":"#fff",fontSize:"14px",fontWeight:"600",cursor:"pointer"}}>Create Account</button>
          </div>

          {err&&<div style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.15)",color:"#ef4444",fontSize:"13px",padding:"12px",borderRadius:"10px",marginBottom:"16px"}}>{err}</div>}
          {msg&&<div style={{background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.15)",color:"#22c55e",fontSize:"13px",padding:"12px",borderRadius:"10px",marginBottom:"16px"}}>{msg}</div>}

          {isLogin ? (
            <form onSubmit={handleLogin} style={{display:"flex",flexDirection:"column",gap:"16px"}}>
              <div><label style={{fontSize:"12px",color:"#6b7280",display:"block",marginBottom:"6px"}}>Email or Username</label>
                <input type="text" value={email} onChange={e=>setE(e.target.value)} placeholder="you@example.com" style={{width:"100%",padding:"14px 16px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"10px",color:"#fff",fontSize:"14px",outline:"none"}} required /></div>
              <div><label style={{fontSize:"12px",color:"#6b7280",display:"block",marginBottom:"6px"}}>Password</label>
                <input type="password" value={pass} onChange={e=>setP(e.target.value)} placeholder="••••••••" style={{width:"100%",padding:"14px 16px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"10px",color:"#fff",fontSize:"14px",outline:"none"}} required /></div>
              <button type="submit" disabled={load} style={{width:"100%",padding:"14px",background:"#d4af37",color:"#000",fontWeight:"600",fontSize:"14px",border:"none",borderRadius:"10px",cursor:"pointer",opacity:load?0.5:1}}>{load?"Signing in...":"Sign In"}</button>
            </form>
          ) : (
            <form onSubmit={handleSignup} style={{display:"flex",flexDirection:"column",gap:"14px"}}>
              <div><label style={{fontSize:"12px",color:"#6b7280",display:"block",marginBottom:"6px"}}>Full Name</label>
                <input type="text" value={name} onChange={e=>setN(e.target.value)} placeholder="John Doe" style={{width:"100%",padding:"14px 16px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"10px",color:"#fff",fontSize:"14px",outline:"none"}} required /></div>
              <div><label style={{fontSize:"12px",color:"#6b7280",display:"block",marginBottom:"6px"}}>Username</label>
                <input type="text" value={user} onChange={e=>setUser(e.target.value)} placeholder="johndoe" style={{width:"100%",padding:"14px 16px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"10px",color:"#fff",fontSize:"14px",outline:"none"}} required /></div>
              <div><label style={{fontSize:"12px",color:"#6b7280",display:"block",marginBottom:"6px"}}>Email</label>
                <input type="email" value={signupEmail} onChange={e=>setSE(e.target.value)} placeholder="you@example.com" style={{width:"100%",padding:"14px 16px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"10px",color:"#fff",fontSize:"14px",outline:"none"}} required /></div>
              <div><label style={{fontSize:"12px",color:"#6b7280",display:"block",marginBottom:"6px"}}>Password</label>
                <input type="password" value={pass} onChange={e=>setP(e.target.value)} placeholder="Min 6 characters" style={{width:"100%",padding:"14px 16px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"10px",color:"#fff",fontSize:"14px",outline:"none"}} required /></div>
              <button type="submit" disabled={load} style={{width:"100%",padding:"14px",background:"#d4af37",color:"#000",fontWeight:"600",fontSize:"14px",border:"none",borderRadius:"10px",cursor:"pointer",opacity:load?0.5:1}}>{load?"Creating...":"Create Account"}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
