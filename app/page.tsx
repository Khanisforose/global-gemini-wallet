"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const r = useRouter();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setE] = useState("");
  const [pass, setP] = useState("");
  const [name, setN] = useState("");
  const [err, setErr] = useState("");
  const [load, setL] = useState(false);

  async function handleLogin(e: any) {
    e.preventDefault();
    setErr(""); setL(true);
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      if (d.user.role === "ADMIN") { r.push("/admin"); } else { r.push("/dashboard"); }
      r.refresh();
    } catch (e: any) { setErr(e.message); } finally { setL(false); }
  }

  async function handleSignup(e: any) {
    e.preventDefault();
    if (pass.length < 6) { setErr("Password must be at least 6 characters"); return; }
    setErr(""); setL(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password: pass }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      r.push("/dashboard");
      r.refresh();
    } catch (e: any) { setErr(e.message); } finally { setL(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0a0a0f]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-black">G</div>
          <h1 className="text-3xl font-bold" style={{fontFamily:"Georgia,serif"}}>Global Gemini <span style={{background:"linear-gradient(135deg,#d4af37,#f0d060)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Wallet</span></h1>
          <p className="text-gray-500 text-sm mt-1">Multi-Currency Wealth Platform</p>
        </div>

        <div style={{background:"rgba(255,255,255,0.04)",backdropFilter:"blur(24px)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"16px",overflow:"hidden"}}>
          <div style={{display:"flex",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
            <button onClick={()=>{setTab("login");setErr("")}}
              style={{flex:1,padding:"12px",fontSize:"14px",fontWeight:"500",textAlign:"center",borderBottom: tab==="login" ? "2px solid #d4af37" : "2px solid transparent",color: tab==="login" ? "#d4af37" : "#6b7280",background: tab==="login" ? "rgba(212,175,55,0.08)" : "transparent"}}>🔐 Sign In</button>
            <button onClick={()=>{setTab("signup");setErr("")}}
              style={{flex:1,padding:"12px",fontSize:"14px",fontWeight:"500",textAlign:"center",borderBottom: tab==="signup" ? "2px solid #d4af37" : "2px solid transparent",color: tab==="signup" ? "#d4af37" : "#6b7280",background: tab==="signup" ? "rgba(212,175,55,0.08)" : "transparent"}}>✨ Create Account</button>
          </div>

          <div style={{padding:"24px"}}>
            {err && <div style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",color:"#ef4444",fontSize:"13px",padding:"10px",borderRadius:"8px",marginBottom:"16px"}}>{err}</div>}

            {tab === "login" ? (
              <form onSubmit={handleLogin} style={{display:"flex",flexDirection:"column",gap:"16px"}}>
                <input type="email" value={email} onChange={e=>setE(e.target.value)} placeholder="you@example.com"
                  style={{width:"100%",padding:"12px 16px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"10px",color:"#fff",fontSize:"14px",outline:"none"}} required />
                <input type="password" value={pass} onChange={e=>setP(e.target.value)} placeholder="Password"
                  style={{width:"100%",padding:"12px 16px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"10px",color:"#fff",fontSize:"14px",outline:"none"}} required />
                <button type="submit" disabled={load}
                  style={{width:"100%",padding:"12px",background:"linear-gradient(135deg,#d4af37,#b8942e)",color:"#000",fontWeight:"600",fontSize:"14px",border:"none",borderRadius:"10px",cursor:"pointer",opacity: load ? 0.5 : 1}}>
                  {load ? "..." : "Sign In"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignup} style={{display:"flex",flexDirection:"column",gap:"16px"}}>
                <input type="text" value={name} onChange={e=>setN(e.target.value)} placeholder="Your name"
                  style={{width:"100%",padding:"12px 16px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"10px",color:"#fff",fontSize:"14px",outline:"none"}} required />
                <input type="email" value={email} onChange={e=>setE(e.target.value)} placeholder="you@example.com"
                  style={{width:"100%",padding:"12px 16px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"10px",color:"#fff",fontSize:"14px",outline:"none"}} required />
                <input type="password" value={pass} onChange={e=>setP(e.target.value)} placeholder="Password (min 6 chars)"
                  style={{width:"100%",padding:"12px 16px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"10px",color:"#fff",fontSize:"14px",outline:"none"}} required />
                <button type="submit" disabled={load}
                  style={{width:"100%",padding:"12px",background:"linear-gradient(135deg,#d4af37,#b8942e)",color:"#000",fontWeight:"600",fontSize:"14px",border:"none",borderRadius:"10px",cursor:"pointer",opacity: load ? 0.5 : 1}}>
                  {load ? "..." : "Create Account"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
