"use client"; import { useState, useEffect } from "react"; import Link from "next/link";
export default function Dashboard() {
  const [user, setU] = useState<any>(null); const [tab, setT] = useState("wallet");
  const [fiat, setF] = useState<any[]>([]); const [total, setTot] = useState(0);
  const [txs, setTxs] = useState<any[]>([]); const [kyc, setK] = useState("UNVERIFIED");
  const [cryptoPrices, setCP] = useState<any>({});
  const [toEmail, setTE] = useState(""); const [sendAmt, setSA] = useState(""); const [sendCurr, setSC] = useState("USD"); const [sendMsg, setSM] = useState(""); const [sendErr, setSE] = useState("");
  const [curPw, setCPw] = useState(""); const [newPw, setNP] = useState(""); const [pwMsg, setPM] = useState("");
  const [refCode] = useState("GEM" + Math.random().toString(36).slice(2,8).toUpperCase());

  // Mock crypto balances
  const cryptoBal = [
    {s:"USDT",b:1250.5,c:"#26a17b"},{s:"BTC",b:0.025,c:"#f7931a"},{s:"ETH",b:0.5,c:"#627eea"},{s:"SOL",b:10,c:"#9945ff"},{s:"BNB",b:2.3,c:"#f3ba2f"}
  ];

  useEffect(() => {
    fetch("/api/auth/me").then(r=>r.json()).then(d => { if (!d.id) { window.location.href="/"; return; } setU(d); setK(d.kycStatus||"UNVERIFIED"); });
    fetch("/api/balances").then(r=>r.json()).then(d => { setF(d.balances||[]); setTot(d.totalUSD||0); });
    fetch("/api/transactions").then(r=>r.json()).then(d => setTxs(d.transactions||[]));
    fetch("/api/crypto/prices").then(r=>r.json()).then(d => setCP(d)).catch(()=>{});
  }, []);

  const sendFunds = async(e:any) => { e.preventDefault(); setSM(""); setSE(""); try { const r=await fetch("/api/transfer",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({to:toEmail,currency:sendCurr,amount:parseFloat(sendAmt)})}); const d=await r.json(); if(!r.ok) throw new Error(d.error); setSM(`✅ Sent ${sendAmt} ${sendCurr}`); setSA(""); setTE(""); } catch(e:any) { setSE(e.message); } };
  const changePw = async(e:any) => { e.preventDefault(); setPM(""); try { const r=await fetch("/api/auth/password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({currentPassword:curPw,newPassword:newPw})}); const d=await r.json(); if(!r.ok) throw new Error(d.error); setPM("✅ Password changed!"); setCPw(""); setNP(""); } catch(e:any) { setPM("Error: "+e.message); } };

  if (!user) return <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]"><div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"/></div>;
  const fmt = (n:number) => "$"+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
  const BG = "rgba(255,255,255,0.03)"; const BR = "1px solid rgba(255,255,255,0.06)"; const IP = {width:"100%",padding:"12px 14px",background:"#1a1a2e",border:BR,borderRadius:"10px",color:"#fff",fontSize:"14px",outline:"none",boxSizing:"border-box"as const};

  return (
    <div style={{minHeight:"100vh",background:"#0a0a0f",color:"#fff",fontFamily:"Inter,sans-serif"}}>
      <div style={{borderBottom:BR,padding:"14px 32px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <span style={{fontFamily:"Georgia,serif",fontSize:"18px",fontWeight:"600"}}>🌍 Global Gemini <span style={{background:"linear-gradient(135deg,#d4af37,#f0d060)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Wallet</span></span>
        <div style={{display:"flex",alignItems:"center",gap:"16px"}}>
          {["wallet","profile","refer","settings"].map(t=>(<button key={t} onClick={()=>setT(t)} style={{fontSize:"13px",padding:"6px 0",background:"none",border:"none",borderBottom:tab===t?"2px solid #d4af37":"2px solid transparent",color:tab===t?"#d4af37":"#6b7280",cursor:"pointer"}}>{t==="wallet"?"💰 Wallet":t==="profile"?"👤 Profile":t==="refer"?"🔗 Refer":"⚙️ Settings"}</button>))}
          <button onClick={async()=>{await fetch("/api/auth/signout",{method:"POST"});window.location.href="/";}} style={{fontSize:"13px",color:"#6b7280",background:"none",border:"none",cursor:"pointer",marginLeft:"8px"}}>Sign Out</button>
        </div>
      </div>

      <div style={{maxWidth:"1400px",margin:"0 auto",padding:"24px 32px"}}>
        {tab==="wallet" && (
          <>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"24px",flexWrap:"wrap",gap:"12px"}}>
              <div><h1 style={{fontSize:"26px",fontWeight:"bold",fontFamily:"Georgia,serif",margin:0}}>Welcome, {user.name} (@{user.username})</h1>
                <p style={{fontSize:"34px",fontWeight:"bold",background:"linear-gradient(135deg,#d4af37,#f0d060)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginTop:"4px"}}>{fmt(total + cryptoBal.reduce((s,x)=>s+(x.b*(cryptoPrices[x.s]||1)),0))} <span style={{fontSize:"14px",color:"#6b7280",fontWeight:"400",WebkitTextFillColor:"#6b7280"}}>total USD</span></p>
              </div>
              <div style={{display:"flex",gap:"8px"}}>
                {kyc==="VERIFIED" ? (<><Link href="/wallet/deposit" style={{padding:"10px 20px",background:"linear-gradient(135deg,#d4af37,#b8942e)",color:"#000",fontWeight:"600",fontSize:"13px",borderRadius:"10px",textDecoration:"none"}}>📥 Deposit</Link><Link href="/wallet/withdraw" style={{padding:"10px 20px",background:"rgba(255,255,255,0.04)",color:"#e5e7eb",fontWeight:"500",fontSize:"13px",borderRadius:"10px",textDecoration:"none",border:BR}}>📤 Withdraw</Link></>) : (<Link href="/kyc" style={{padding:"10px 20px",background:"linear-gradient(135deg,#d4af37,#b8942e)",color:"#000",fontWeight:"600",fontSize:"13px",borderRadius:"10px",textDecoration:"none"}}>📋 Complete KYC</Link>)}
              </div>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px",marginBottom:"20px"}}>
              <div style={{background:BG,backdropFilter:"blur(24px)",border:BR,borderRadius:"16px",padding:"20px"}}>
                <h2 style={{fontSize:"16px",fontWeight:"600",fontFamily:"Georgia,serif",marginBottom:"12px"}}>💵 Fiat Currencies</h2>
                <div style={{maxHeight:"300px",overflowY:"auto"}}>{fiat.map((b:any)=><div key={b.currency} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:BR}}><div><span style={{fontWeight:"500"}}>{b.currency}</span><span style={{marginLeft:"8px",fontFamily:"Georgia,serif"}}>{b.amount.toLocaleString("en-US",{minimumFractionDigits:2})}</span></div><span style={{color:"#d4af37"}}>{fmt(b.usdValue)}</span></div>)}</div>
              </div>
              <div style={{background:BG,backdropFilter:"blur(24px)",border:BR,borderRadius:"16px",padding:"20px"}}>
                <h2 style={{fontSize:"16px",fontWeight:"600",fontFamily:"Georgia,serif",marginBottom:"12px"}}>🪙 Crypto <span style={{fontSize:"11px",color:"#6b7280",fontWeight:"400"}}>Live prices</span></h2>
                {cryptoBal.map(x=>(
                  <div key={x.s} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:BR}}>
                    <div><span style={{fontWeight:"500",color:x.c}}>{x.s}</span><span style={{marginLeft:"8px",fontFamily:"Georgia,serif",fontSize:"13px"}}>{x.b.toLocaleString("en-US",{minimumFractionDigits:4})}</span>
                      <span style={{fontSize:"11px",color:"#6b7280",marginLeft:"6px"}}>@ ${cryptoPrices[x.s]?.toLocaleString()||"..."}</span>
                    </div>
                    <span style={{color:"#d4af37"}}>{fmt(x.b*(cryptoPrices[x.s]||1))}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Send - supports email or username, fiat or crypto */}
            <div style={{background:BG,backdropFilter:"blur(24px)",border:BR,borderRadius:"16px",padding:"20px",marginBottom:"20px"}}>
              <h2 style={{fontSize:"16px",fontWeight:"600",fontFamily:"Georgia,serif",marginBottom:"12px"}}>📤 Send to another user</h2>
              {sendMsg&&<div style={{background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.15)",color:"#22c55e",fontSize:"12px",padding:"10px",borderRadius:"8px",marginBottom:"12px"}}>{sendMsg}</div>}
              {sendErr&&<div style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.15)",color:"#ef4444",fontSize:"12px",padding:"10px",borderRadius:"8px",marginBottom:"12px"}}>{sendErr}</div>}
              <form onSubmit={sendFunds} style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
                <input type="text" value={toEmail} onChange={e=>setTE(e.target.value)} placeholder="Email or Username" style={{...IP,flex:1,minWidth:"200px"}} required />
                <input type="number" step="0.01" min="0.01" value={sendAmt} onChange={e=>setSA(e.target.value)} placeholder="Amount" style={{...IP,width:"120px"}} required />
                <select value={sendCurr} onChange={e=>setSC(e.target.value)} style={{...IP,width:"90px"}}><option>USD</option><option>EUR</option><option>GBP</option><option>USDT</option><option>BTC</option><option>ETH</option><option>SOL</option></select>
                <button type="submit" style={{padding:"12px 24px",background:"linear-gradient(135deg,#d4af37,#b8942e)",color:"#000",fontWeight:"600",fontSize:"14px",border:"none",borderRadius:"10px",cursor:"pointer"}}>Send</button>
              </form>
            </div>

            {/* Transactions */}
            <div style={{background:BG,backdropFilter:"blur(24px)",border:BR,borderRadius:"16px",padding:"20px"}}>
              <h2 style={{fontSize:"16px",fontWeight:"600",fontFamily:"Georgia,serif",marginBottom:"12px"}}>📋 Transaction History</h2>
              {txs.length===0?<p style={{color:"#6b7280",textAlign:"center",padding:"16px"}}>No transactions</p>:txs.slice(0,25).map((tx:any)=>(
                <div key={tx.id} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:BR}}>
                  <div><span style={{fontSize:"12px",fontWeight:"500",color:tx.type==="TRANSFER"?"#a78bfa":tx.type==="ADMIN_FUNDING"||tx.type==="DEPOSIT"?"#22c55e":"#d4af37"}}>{tx.type==="TRANSFER"?"Sent":tx.type==="ADMIN_FUNDING"?"Credited":"Received"}</span>{tx.description&&<p style={{fontSize:"11px",color:"#6b7280"}}>{tx.description}</p>}</div>
                  <div style={{textAlign:"right"}}><span style={{fontSize:"13px",color:"#22c55e"}}>+{Number(tx.amount).toLocaleString("en-US",{minimumFractionDigits:2})} {tx.currency}</span><p style={{fontSize:"11px",color:"#4b5563"}}>{new Date(tx.createdAt).toLocaleDateString()}</p></div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab==="profile" && (
          <div style={{background:BG,backdropFilter:"blur(24px)",border:BR,borderRadius:"16px",padding:"24px",maxWidth:"500px"}}>
            <h2 style={{fontSize:"20px",fontWeight:"bold",fontFamily:"Georgia,serif",marginBottom:"20px"}}>👤 My Profile</h2>
            <div style={{marginBottom:"12px"}}><label style={{fontSize:"12px",color:"#6b7280",display:"block",marginBottom:"4px"}}>Name</label><div style={{padding:"12px",background:"rgba(255,255,255,0.05)",borderRadius:"10px",fontSize:"14px"}}>{user.name}</div></div>
            <div style={{marginBottom:"12px"}}><label style={{fontSize:"12px",color:"#6b7280",display:"block",marginBottom:"4px"}}>Username</label><div style={{padding:"12px",background:"rgba(255,255,255,0.05)",borderRadius:"10px",fontSize:"14px",color:"#d4af37"}}>@{user.username}</div></div>
            <div style={{marginBottom:"12px"}}><label style={{fontSize:"12px",color:"#6b7280",display:"block",marginBottom:"4px"}}>Email</label><div style={{padding:"12px",background:"rgba(255,255,255,0.05)",borderRadius:"10px",fontSize:"14px"}}>{user.email}</div></div>
            <div style={{marginBottom:"12px"}}><label style={{fontSize:"12px",color:"#6b7280",display:"block",marginBottom:"4px"}}>KYC</label><div style={{padding:"12px",background:"rgba(255,255,255,0.05)",borderRadius:"10px",fontSize:"14px"}}><span style={{color:kyc==="VERIFIED"?"#22c55e":kyc==="PENDING"?"#facc15":"#ef4444"}}>{kyc}</span></div></div>
          </div>
        )}

        {tab==="refer" && (
          <div style={{background:BG,backdropFilter:"blur(24px)",border:BR,borderRadius:"16px",padding:"24px",maxWidth:"500px"}}>
            <h2 style={{fontSize:"20px",fontWeight:"bold",fontFamily:"Georgia,serif",marginBottom:"20px"}}>🔗 Referral Program</h2>
            <div style={{background:"rgba(212,175,55,0.08)",border:"1px solid rgba(212,175,55,0.15)",borderRadius:"12px",padding:"16px",marginBottom:"16px",textAlign:"center"}}>
              <p style={{fontSize:"12px",color:"#6b7280",marginBottom:"4px"}}>Your Code</p>
              <p style={{fontSize:"28px",fontWeight:"bold",fontFamily:"Georgia,serif",background:"linear-gradient(135deg,#d4af37,#f0d060)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{refCode}</p>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"16px"}}>
              <div style={{background:"rgba(255,255,255,0.03)",borderRadius:"10px",padding:"16px",textAlign:"center"}}><div style={{fontSize:"20px",fontWeight:"bold",color:"#60a5fa"}}>3</div><div style={{fontSize:"11px",color:"#6b7280",marginTop:"4px"}}>Active</div></div>
              <div style={{background:"rgba(255,255,255,0.03)",borderRadius:"10px",padding:"16px",textAlign:"center"}}><div style={{fontSize:"20px",fontWeight:"bold",color:"#22c55e"}}>$250</div><div style={{fontSize:"11px",color:"#6b7280",marginTop:"4px"}}>Income</div></div>
            </div>
          </div>
        )}

        {tab==="settings" && (
          <div style={{maxWidth:"500px"}}>
            <div style={{background:BG,backdropFilter:"blur(24px)",border:BR,borderRadius:"16px",padding:"24px",marginBottom:"20px"}}>
              <h2 style={{fontSize:"20px",fontWeight:"bold",fontFamily:"Georgia,serif",marginBottom:"20px"}}>⚙️ Settings</h2>
              <div style={{marginBottom:"16px"}}>
                <label style={{fontSize:"12px",color:"#6b7280",display:"block",marginBottom:"8px"}}>Theme</label>
                <div style={{display:"flex",gap:"8px"}}>
                  <button onClick={()=>{document.documentElement.setAttribute("data-theme","dark");localStorage.setItem("theme","dark")}} style={{padding:"10px 20px",borderRadius:"10px",border:"1px solid rgba(255,255,255,0.1)",background:"rgba(212,175,55,0.1)",color:"#fff",cursor:"pointer",fontSize:"13px"}}>🌙 Dark</button>
                  <button onClick={()=>{document.documentElement.setAttribute("data-theme","light");localStorage.setItem("theme","light")}} style={{padding:"10px 20px",borderRadius:"10px",border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.03)",color:"#fff",cursor:"pointer",fontSize:"13px"}}>☀️ Light</button>
                </div>
              </div>
            </div>
            <div style={{background:BG,backdropFilter:"blur(24px)",border:BR,borderRadius:"16px",padding:"24px"}}>
              <h2 style={{fontSize:"16px",fontWeight:"600",fontFamily:"Georgia,serif",marginBottom:"16px"}}>🔑 Change Password</h2>
              {pwMsg&&<div style={{background:pwMsg.includes("✅")?"rgba(34,197,94,0.1)":"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.15)",color:pwMsg.includes("✅")?"#22c55e":"#ef4444",fontSize:"12px",padding:"10px",borderRadius:"8px",marginBottom:"12px"}}>{pwMsg}</div>}
              <form onSubmit={changePw} style={{display:"flex",flexDirection:"column",gap:"12px"}}>
                <input type="password" value={curPw} onChange={e=>setCPw(e.target.value)} placeholder="Current password" style={IP} required />
                <input type="password" value={newPw} onChange={e=>setNP(e.target.value)} placeholder="New password" style={IP} required />
                <button type="submit" style={{padding:"12px",background:"linear-gradient(135deg,#d4af37,#b8942e)",color:"#000",fontWeight:"600",fontSize:"14px",border:"none",borderRadius:"10px",cursor:"pointer"}}>Change</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
