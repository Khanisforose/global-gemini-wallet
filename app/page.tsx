"use client"; import { useState } from "react";
export default function HomePage() {
  const [page, setPage] = useState("home");
  const [isLogin, setIsLogin] = useState(true);
  const [email, setE] = useState(""); const [pass, setP] = useState(""); const [name, setN] = useState(""); const [user, setUser] = useState(""); const [err, setErr] = useState(""); const [msg, setMsg] = useState(""); const [load, setL] = useState(false);
  const [signupEmail, setSE] = useState("");

  async function handleLogin(e:any) { e.preventDefault(); setErr(""); setL(true); try { const r=await fetch("/api/auth/signin",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password:pass})}); const d=await r.json(); if(!r.ok) throw new Error(d.error); window.location.href = d.user.role==="ADMIN"?"/admin":"/dashboard"; } catch(e:any) { setErr(e.message); } finally { setL(false); } }
  async function handleSignup(e:any) { e.preventDefault(); if(pass.length<6){setErr("Password min 6 chars");return} setErr(""); setL(true); try { const r=await fetch("/api/auth/signup",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:signupEmail,username:user,name,password:pass})}); const d=await r.json(); if(!r.ok) throw new Error(d.error); setMsg("✅ Account created! Please sign in."); setIsLogin(true); setE(signupEmail); setP(""); } catch(e:any) { setErr(e.message); } finally { setL(false); } }

  const nav = [
    {k:"home",l:"Home"},{k:"services",l:"Services"},{k:"earn",l:"Join & Earn"},{k:"about",l:"About Us"}
  ];

  return (
    <div style={{minHeight:"100vh",background:"#0a0a0f",color:"#fff",fontFamily:"Inter,sans-serif"}}>
      {/* Navigation */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 5%",borderBottom:"1px solid rgba(255,255,255,0.06)",backdropFilter:"blur(20px)",background:"rgba(10,10,15,0.8)",position:"sticky",top:0,zIndex:100}}>
        <div className="row">
          <div style={{width:"36px",height:"36px",borderRadius:"10px",background:"linear-gradient(135deg,#d4af37,#b8942e)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"16px",fontWeight:"bold",color:"#000"}}>G</div>
          <span className="font-display" style={{fontSize:"18px",fontWeight:"700"}}>Global Gemini <span className="text-gradient">Wallet</span></span>
        </div>
        <div className="row" style={{gap:"24px"}}>
          {nav.map(n=>(
            <button key={n.k} onClick={()=>setPage(n.k)} style={{fontSize:"14px",color:page===n.k?"#d4af37":"#9ca3af",background:"none",border:"none",cursor:"pointer",fontWeight:page===n.k?"600":"400",position:"relative"}}>
              {n.l}
              {page===n.k && <div style={{position:"absolute",bottom:"-20px",left:"50%",transform:"translateX(-50%)",width:"20px",height:"2px",background:"#d4af37",borderRadius:"2px"}}/>}
            </button>
          ))}
        </div>
        <div className="row">
          <button onClick={()=>{setPage("home");setIsLogin(true)}} className="btn btn-secondary btn-sm">Sign In</button>
          <button onClick={()=>{setPage("home");setIsLogin(false)}} className="btn btn-primary btn-sm">Get Started</button>
        </div>
      </div>

      {/* HOME - Split Layout */}
      {page==="home" && (
        <div style={{display:"flex",minHeight:"calc(100vh - 70px)"}}>
          <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"80px 5%",background:"radial-gradient(ellipse at 30% 50%,rgba(212,175,55,0.05) 0%,transparent 60%)"}}>
            <div style={{maxWidth:"520px"}}>
              <div style={{display:"inline-flex",padding:"6px 16px",background:"rgba(212,175,55,0.1)",border:"1px solid rgba(212,175,55,0.15)",borderRadius:"100px",fontSize:"12px",color:"#d4af37",marginBottom:"24px"}}>✦ Multi-Currency Wealth Platform</div>
              <h1 style={{fontSize:"56px",fontWeight:"800",fontFamily:"Georgia,serif",lineHeight:"1.1",marginBottom:"16px"}}>Your Global<br/><span className="text-gradient">Financial Hub</span></h1>
              <p style={{fontSize:"16px",color:"#6b7280",lineHeight:"1.8",marginBottom:"32px"}}>Manage 170+ fiat currencies and major cryptocurrencies in one unified platform. Send money, track live prices, deposit via UPI, Bank, PayPal, or Crypto, and earn rewards.</p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"12px",marginBottom:"32px"}}>
                {[{v:"170+",l:"Fiat Currencies"},{v:"4",l:"Cryptocurrencies"},{v:"5+",l:"Payment Methods"},{v:"100%",l:"Secure Platform"}].map(s=>(
                  <div key={s.l} style={{padding:"16px",background:"rgba(255,255,255,0.03)",borderRadius:"10px",textAlign:"center"}}>
                    <div style={{fontSize:"22px",fontWeight:"700"}}><span className="text-gradient">{s.v}</span></div>
                    <div style={{fontSize:"11px",color:"#6b7280",marginTop:"4px"}}>{s.l}</div>
                  </div>
                ))}
              </div>
              <div className="row" style={{gap:"24px",fontSize:"13px"}}>
                <div className="row"><span style={{color:"#22c55e",fontSize:"16px"}}>✓</span> KYC Verified</div>
                <div className="row"><span style={{color:"#22c55e",fontSize:"16px"}}>✓</span> Live Exchange Rates</div>
                <div className="row"><span style={{color:"#22c55e",fontSize:"16px"}}>✓</span> 24/7 Support</div>
              </div>
            </div>
          </div>
          <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"60px 5%"}}>
            <div style={{width:"100%",maxWidth:"400px"}}>
              <div className="row" style={{marginBottom:"28px",gap:"12px"}}>
                <button onClick={()=>{setIsLogin(true);setErr("");setMsg("")}} style={{flex:1,padding:"12px",borderRadius:"10px",border:"none",background:isLogin?"#d4af37":"rgba(255,255,255,0.05)",color:isLogin?"#000":"#fff",fontSize:"14px",fontWeight:"600",cursor:"pointer"}}>🔐 Sign In</button>
                <button onClick={()=>{setIsLogin(false);setErr("");setMsg("")}} style={{flex:1,padding:"12px",borderRadius:"10px",border:"none",background:!isLogin?"#d4af37":"rgba(255,255,255,0.05)",color:!isLogin?"#000":"#fff",fontSize:"14px",fontWeight:"600",cursor:"pointer"}}>✨ Register</button>
              </div>
              {err&&<div style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.15)",color:"#ef4444",fontSize:"13px",padding:"12px",borderRadius:"10px",marginBottom:"16px"}}>{err}</div>}
              {msg&&<div style={{background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.15)",color:"#22c55e",fontSize:"13px",padding:"12px",borderRadius:"10px",marginBottom:"16px"}}>{msg}</div>}
              {isLogin ? (
                <form onSubmit={handleLogin} style={{display:"flex",flexDirection:"column",gap:"16px"}}>
                  <input type="text" value={email} onChange={e=>setE(e.target.value)} placeholder="Email or Username" className="input" style={{padding:"14px 16px"}} required />
                  <input type="password" value={pass} onChange={e=>setP(e.target.value)} placeholder="Password" className="input" style={{padding:"14px 16px"}} required />
                  <button type="submit" disabled={load} className="btn btn-primary" style={{padding:"14px",fontSize:"15px",width:"100%"}}>{load?"Signing in...":"Sign In"}</button>
                </form>
              ) : (
                <form onSubmit={handleSignup} style={{display:"flex",flexDirection:"column",gap:"14px"}}>
                  <input type="text" value={name} onChange={e=>setN(e.target.value)} placeholder="Full Name" className="input" style={{padding:"14px 16px"}} required />
                  <input type="text" value={user} onChange={e=>setUser(e.target.value)} placeholder="Username" className="input" style={{padding:"14px 16px"}} required />
                  <input type="email" value={signupEmail} onChange={e=>setSE(e.target.value)} placeholder="Email" className="input" style={{padding:"14px 16px"}} required />
                  <input type="password" value={pass} onChange={e=>setP(e.target.value)} placeholder="Password (min 6 chars)" className="input" style={{padding:"14px 16px"}} required />
                  <button type="submit" disabled={load} className="btn btn-primary" style={{padding:"14px",fontSize:"15px",width:"100%"}}>{load?"Creating...":"Create Free Account"}</button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SERVICES */}
      {page==="services" && (
        <div style={{padding:"80px 5%",maxWidth:"1100px",margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:"48px"}}>
            <h2 className="font-display" style={{fontSize:"36px",fontWeight:"700",marginBottom:"12px"}}>Our <span className="text-gradient">Services</span></h2>
            <p style={{color:"#6b7280",fontSize:"15px"}}>Comprehensive financial tools for the modern world</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"24px"}}>
            {[
              {i:"💱",t:"Multi-Currency Wallet",d:"Hold and manage 170+ fiat currencies including USD, EUR, GBP, JPY, INR, and more. All with live exchange rates updated in real-time."},
              {i:"🪙",t:"Crypto Portfolio",d:"Support for Bitcoin (BTC), Ethereum (ETH), Solana (SOL), and Tether (USDT). Live market prices, instant conversion, and secure storage."},
              {i:"📤",t:"Peer-to-Peer Transfers",d:"Send money to any user instantly using their email or username. Support for both fiat and cryptocurrency transfers with zero fees."},
              {i:"📥",t:"Deposit Methods",d:"Fund your wallet via UPI, Bank Transfer (NEFT/IMPS), PayPal, Stripe, or Cryptocurrency deposits from external wallets."},
              {i:"📤",t:"Withdrawal Options",d:"Withdraw your funds to UPI ID, Bank Account, PayPal, or external Crypto wallets. Admin-verified for maximum security."},
              {i:"📋",t:"KYC Verification",d:"Secure identity verification with document upload. Once verified, unlock full platform features including deposits and withdrawals."},
              {i:"🔗",t:"Referral Program",d:"Earn $10 per new referral plus 0.8% of their wallet balance. Unlimited referrals, no caps on earnings."},
              {i:"📊",t:"Live Market Data",d:"Real-time exchange rates for all fiat currencies via Neon database and crypto prices via CoinGecko API. Updated every 60 seconds."},
              {i:"🔐",t:"Bank-Grade Security",d:"Encrypted authentication, secure cookies, admin oversight, and full transaction audit logs. Your funds are always protected."},
            ].map(s=>(
              <div key={s.t} className="card" style={{padding:"28px",transition:"all 0.3s"}} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                <div style={{fontSize:"36px",marginBottom:"12px"}}>{s.i}</div>
                <h3 style={{fontSize:"16px",fontWeight:"600",marginBottom:"8px"}}>{s.t}</h3>
                <p style={{fontSize:"13px",color:"#6b7280",lineHeight:"1.7"}}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* JOIN & EARN */}
      {page==="earn" && (
        <div style={{padding:"80px 5%",maxWidth:"900px",margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:"48px"}}>
            <h2 className="font-display" style={{fontSize:"36px",fontWeight:"700",marginBottom:"12px"}}>Join & <span className="text-gradient">Earn</span></h2>
            <p style={{color:"#6b7280",fontSize:"15px"}}>Invite friends and earn passive income</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"32px"}}>
            <div style={{background:"rgba(212,175,55,0.06)",border:"1px solid rgba(212,175,55,0.12)",borderRadius:"20px",padding:"40px",textAlign:"center"}}>
              <div style={{fontSize:"48px",marginBottom:"16px"}}>💰</div>
              <h3 style={{fontSize:"22px",fontWeight:"700",marginBottom:"8px"}}>$10 <span className="text-gradient">Per Referral</span></h3>
              <p style={{color:"#6b7280",fontSize:"14px",lineHeight:"1.7",marginBottom:"16px"}}>Earn a flat <strong style={{color:"#d4af37"}}>$10 bonus</strong> for every new user who signs up using your referral link. No minimums, no caps.</p>
              <div className="badge badge-green" style={{fontSize:"12px",padding:"6px 16px"}}>Paid instantly</div>
            </div>
            <div style={{background:"rgba(96,165,250,0.06)",border:"1px solid rgba(96,165,250,0.12)",borderRadius:"20px",padding:"40px",textAlign:"center"}}>
              <div style={{fontSize:"48px",marginBottom:"16px"}}>📈</div>
              <h3 style={{fontSize:"22px",fontWeight:"700",marginBottom:"8px"}}>0.8% <span className="text-gradient">Ongoing</span></h3>
              <p style={{color:"#6b7280",fontSize:"14px",lineHeight:"1.7",marginBottom:"16px"}}>Earn <strong style={{color:"#60a5fa"}}>0.8% annually</strong> on the balance your referrals maintain in their wallet. Passive income that grows as they grow.</p>
              <div className="badge badge-blue" style={{fontSize:"12px",padding:"6px 16px"}}>Paid monthly</div>
            </div>
          </div>
          <div style={{marginTop:"32px",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"16px",padding:"32px"}}>
            <h3 style={{fontSize:"18px",fontWeight:"600",marginBottom:"16px"}}>How it works</h3>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"24px"}}>
              {[{n:"1",t:"Share",d:"Share your unique referral code with friends"},{n:"2",t:"Invite",d:"They sign up and verify their account"},{n:"3",t:"Earn",d:"You earn $10 + 0.8% of their balance"}].map(s=>(
                <div key={s.n} style={{textAlign:"center"}}>
                  <div style={{width:"40px",height:"40px",borderRadius:"50%",background:"rgba(212,175,55,0.12)",color:"#d4af37",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"16px",fontWeight:"700",margin:"0 auto 12px"}}>{s.n}</div>
                  <h4 style={{fontSize:"14px",fontWeight:"600",marginBottom:"4px"}}>{s.t}</h4>
                  <p style={{fontSize:"12px",color:"#6b7280"}}>{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ABOUT US */}
      {page==="about" && (
        <div style={{padding:"80px 5%",maxWidth:"900px",margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:"48px"}}>
            <h2 className="font-display" style={{fontSize:"36px",fontWeight:"700",marginBottom:"12px"}}>About <span className="text-gradient">Us</span></h2>
            <p style={{color:"#6b7280",fontSize:"15px"}}">The future of multi-currency wealth management</p>
          </div>
          <div className="card" style={{padding:"40px",lineHeight:"1.9",color:"#9ca3af",fontSize:"14px",marginBottom:"32px"}}>
            <p style={{marginBottom:"16px"}}>Global Gemini Wallet is a next-generation financial platform that combines traditional fiat currencies with cryptocurrencies in a single, unified interface. We provide individuals and businesses with the tools to manage, send, and grow their wealth across 170+ currencies.</p>
            <p style={{marginBottom:"16px"}}>Our platform features live exchange rates for both fiat and crypto markets, peer-to-peer transfers, multiple deposit methods including UPI, Bank Transfer, PayPal, and Crypto, plus a generous referral program.</p>
            <p>With KYC verification, encrypted authentication, and admin oversight, we ensure your funds and data remain secure at all times.</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"16px"}}>
            {[{v:"2025",l:"Founded"},{v:"170+",l:"Currencies"},{v:"5+",l:"Payment Methods"},{v:"100%",l:"Secure"}].map(s=>(
              <div key={s.l} className="stat"><div className="stat-value"><span className="text-gradient">{s.v}</span></div><div className="stat-label">{s.l}</div></div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{borderTop:"1px solid rgba(255,255,255,0.06)",padding:"24px 5%",textAlign:"center",fontSize:"12px",color:"#4b5563"}}>
        © 2025 Global Gemini Wallet. All rights reserved.
      </div>
    </div>
  );
}
