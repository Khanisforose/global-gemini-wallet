"use client"; import { useState } from "react";
export default function HomePage() {
  const [tab, setTab] = useState<"login" | "signup" | "verify">("login");
  const [email, setE] = useState(""); const [pass, setP] = useState(""); const [name, setN] = useState(""); const [user, setUser] = useState(""); const [otp, setOtp] = useState(""); const [err, setErr] = useState(""); const [msg, setMsg] = useState(""); const [load, setL] = useState(false);
  const [signupEmail, setSE] = useState("");

  async function handleLogin(e: any) { e.preventDefault(); setErr(""); setL(true); try { const r=await fetch("/api/auth/signin",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password:pass})}); const d=await r.json(); if(!r.ok) throw new Error(d.error); window.location.href = d.user.role==="ADMIN"?"/admin":"/dashboard"; } catch(e:any) { setErr(e.message); } finally { setL(false); } }
  async function handleSignup(e: any) { e.preventDefault(); if(pass.length<6){setErr("Password min 6 chars");return} setErr(""); setL(true); try { const r=await fetch("/api/auth/signup",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:signupEmail,username:user,name,password:pass})}); const d=await r.json(); if(!r.ok) throw new Error(d.error); setMsg(d.message||"Account created! Check email for code."); setSE(signupEmail); setTab("verify"); } catch(e:any) { setErr(e.message); } finally { setL(false); } }
  async function handleVerify(e: any) { e.preventDefault(); setErr(""); setL(true); try { const r=await fetch("/api/auth/verify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:signupEmail,otp})}); const d=await r.json(); if(!r.ok) throw new Error(d.error); setMsg("✅ Verified! Redirecting..."); setTimeout(()=>{window.location.href="/dashboard"},1000); } catch(e:any) { setErr(e.message); } finally { setL(false); } }

  const IP = {width:"100%",padding:"12px 14px",background:"#1a1a2e",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"10px",color:"#fff",fontSize:"14px",outline:"none",boxSizing:"border-box" as const};
  const BTN = {width:"100%",padding:"12px",background:"linear-gradient(135deg,#d4af37,#b8942e)",color:"#000",fontWeight:"600",fontSize:"14px",border:"none",borderRadius:"10px",cursor:"pointer",opacity:load?0.5:1};
  const TABS = ["login","signup"].map(t=>({key:t,label:t==="login"?"🔐 Sign In":"✨ Sign Up"}));

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#0a0a0f",fontFamily:"Inter,sans-serif"}}>
      <div style={{width:"100%",maxWidth:"420px",padding:"20px"}}>
        <div style={{textAlign:"center",marginBottom:"24px"}}>
          <div style={{width:"56px",height:"56px",borderRadius:"50%",background:"linear-gradient(135deg,#d4af37,#b8942e)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",fontSize:"24px",fontWeight:"bold",color:"#000"}}>G</div>
          <h1 style={{fontSize:"24px",fontWeight:"bold",fontFamily:"Georgia,serif",margin:0,color:"#fff"}}>Global Gemini <span style={{background:"linear-gradient(135deg,#d4af37,#f0d060)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Wallet</span></h1>
        </div>

        <div style={{background:"rgba(255,255,255,0.03)",backdropFilter:"blur(24px)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"16px",overflow:"hidden"}}>
          {tab !== "verify" && (
            <div style={{display:"flex",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
              {TABS.map(t=>(
                <button key={t.key} onClick={()=>{setTab(t.key as any);setErr("");setMsg("")}}
                  style={{flex:1,padding:"12px",fontSize:"14px",fontWeight:"500",background:tab===t.key?"rgba(212,175,55,0.08)":"transparent",border:"none",borderBottom:tab===t.key?"2px solid #d4af37":"2px solid transparent",color:tab===t.key?"#d4af37":"#6b7280",cursor:"pointer"}}>{t.label}</button>
              ))}
            </div>
          )}

          <div style={{padding:"24px"}}>
            {err && <div style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.15)",color:"#ef4444",fontSize:"12px",padding:"10px",borderRadius:"8px",marginBottom:"12px"}}>{err}</div>}
            {msg && <div style={{background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.15)",color:"#22c55e",fontSize:"12px",padding:"10px",borderRadius:"8px",marginBottom:"12px"}}>{msg}</div>}

            {tab==="login" && (
              <form onSubmit={handleLogin} style={{display:"flex",flexDirection:"column",gap:"12px"}}>
                <input type="email" value={email} onChange={e=>setE(e.target.value)} placeholder="Email or Username" style={IP} required />
                <input type="password" value={pass} onChange={e=>setP(e.target.value)} placeholder="Password" style={IP} required />
                <button type="submit" disabled={load} style={BTN}>{load?"Signing in...":"🔐 Sign In"}</button>
              </form>
            )}

            {tab==="signup" && (
              <form onSubmit={handleSignup} style={{display:"flex",flexDirection:"column",gap:"12px"}}>
                <input type="text" value={name} onChange={e=>setN(e.target.value)} placeholder="Full Name" style={IP} required />
                <input type="text" value={user} onChange={e=>setUser(e.target.value)} placeholder="Username" style={IP} required />
                <input type="email" value={signupEmail} onChange={e=>setSE(e.target.value)} placeholder="Email" style={IP} required />
                <input type="password" value={pass} onChange={e=>setP(e.target.value)} placeholder="Password (min 6 chars)" style={IP} required />
                <button type="submit" disabled={load} style={BTN}>{load?"Creating...":"✨ Create Account"}</button>
              </form>
            )}

            {tab==="verify" && (
              <form onSubmit={handleVerify} style={{display:"flex",flexDirection:"column",gap:"12px"}}>
                <p style={{color:"#9ca3af",fontSize:"13px",textAlign:"center",margin:0}}>Enter the 6-digit code sent to {signupEmail}</p>
                <input type="text" value={otp} onChange={e=>setOtp(e.target.value)} placeholder="000000" maxLength={6} style={{...IP,textAlign:"center",fontSize:"24px",letterSpacing:"8px"}} required />
                <button type="submit" disabled={load} style={BTN}>{load?"Verifying...":"✅ Verify Email"}</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
