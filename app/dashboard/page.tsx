"use client"; import { useState, useEffect } from "react"; import Link from "next/link";
export default function Dashboard() {
  const [user, setU] = useState<any>(null); const [tab, setT] = useState("wallet");
  const [fiat, setF] = useState<any[]>([]); const [crypto, setC] = useState<any[]>([]); const [total, setTot] = useState(0);
  const [txs, setTxs] = useState<any[]>([]); const [kyc, setK] = useState("UNVERIFIED");
  const [to, setTo] = useState(""); const [sendAmt, setSA] = useState(""); const [sendCurr, setSC] = useState("USD"); const [sendMsg, setSM] = useState(""); const [sendErr, setSE] = useState("");
  const [curPw, setCP] = useState(""); const [newPw, setNP] = useState(""); const [pwMsg, setPM] = useState("");
  const [refCode] = useState("GEM" + Math.random().toString(36).slice(2,8).toUpperCase());
  const coinColors: Record<string,string> = { BTC:"#f7931a", ETH:"#627eea", SOL:"#9945ff", USDT:"#26a17b" };
  const txColors: Record<string,string> = { TRANSFER:"#a78bfa", ADMIN_FUNDING:"#22c55e", DEPOSIT:"#22c55e" };
  const txLabels: Record<string,string> = { TRANSFER:"Sent", ADMIN_FUNDING:"Deposited", DEPOSIT:"Received" };

  useEffect(() => {
    fetch("/api/auth/me").then(r=>r.json()).then(d => { if (!d.id) { window.location.href="/"; return; } setU(d); setK(d.kycStatus||"UNVERIFIED"); });
    fetch("/api/balances").then(r=>r.json()).then(d => { setF(d.balances||[]); setC(d.crypto||[]); setTot(d.totalUSD||0); });
    fetch("/api/transactions").then(r=>r.json()).then(d => setTxs(d.transactions||[]));
  }, []);

  const sendFunds = async(e:any) => { e.preventDefault(); setSM(""); setSE(""); try { const r=await fetch("/api/transfer",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({to,currency:sendCurr,amount:parseFloat(sendAmt)})}); const d=await r.json(); if(!r.ok) throw new Error(d.error); setSM(`✅ Sent ${sendAmt} ${sendCurr}`); setSA(""); setTo(""); } catch(e:any) { setSE(e.message); } };
  const changePw = async(e:any) => { e.preventDefault(); setPM(""); try { const r=await fetch("/api/auth/password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({currentPassword:curPw,newPassword:newPw})}); const d=await r.json(); if(!r.ok) throw new Error(d.error); setPM("✅ Password changed!"); setCP(""); setNP(""); } catch(e:any) { setPM("Error: "+e.message); } };

  if (!user) return <div className="app"><div className="loading"/></div>;
  const fmt = (n:number) => "$"+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <span className="font-display" style={{fontSize:"18px",fontWeight:"700"}}>🌍 Global Gemini <span className="text-gradient">Wallet</span></span>
          <div className="row">
            {[{k:"wallet",l:"💰 Wallet"},{k:"profile",l:"👤 Profile"},{k:"refer",l:"🔗 Refer"},{k:"settings",l:"⚙️ Settings"}].map(t=>(
              <button key={t.k} onClick={()=>setT(t.k)} className={`tab ${tab===t.k?"active":""}`}>{t.l}</button>
            ))}
            <button onClick={async()=>{await fetch("/api/auth/signout",{method:"POST"});window.location.href="/";}} className="btn btn-secondary btn-sm hide-mobile" style={{marginLeft:"8px"}}>Sign Out</button>
          </div>
        </div>
      </header>
      <main className="main">
        {tab==="wallet" && (
          <div className="fade-in">
            <div className="row-between" style={{marginBottom:"24px",flexWrap:"wrap",gap:"12px"}}>
              <div><h1 className="font-display" style={{fontSize:"28px",fontWeight:"700"}}>Welcome, {user.name}</h1>
                <p style={{fontSize:"36px",fontWeight:"700",marginTop:"4px"}}><span className="text-gradient">{fmt(total)}</span> <span className="text-muted" style={{fontSize:"14px",fontWeight:"400"}}>total value</span></p>
              </div>
              <div className="row-wrap">
                <><Link href="/wallet/deposit" className="btn btn-primary">📥 Deposit</Link><Link href="/wallet/withdraw" className="btn btn-secondary">📤 Withdraw</Link><Link href="/wallet/swap" className="btn btn-secondary">🔄 Swap</Link><Link href="/kyc" className="btn btn-secondary btn-sm">📋 KYC</Link></>
              </div>
            </div>
            <div className="grid-2" style={{marginBottom:"24px"}}>
              <div className="card" style={{padding:"24px"}}>
                <h3 className="font-display" style={{fontSize:"16px",fontWeight:"600",marginBottom:"16px"}}>💵 Fiat <span className="text-muted" style={{fontSize:"12px",fontWeight:"400"}}>All currencies</span></h3>
                {fiat.length===0 ? <div><p className="text-muted text-sm">No balance yet</p><p className="text-xs text-muted" style={{marginTop:"8px"}}>Ask admin to credit your account</p></div> : fiat.map((b:any)=>(
                  <div key={b.currency} className="row-between" style={{padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                    <div><span style={{fontWeight:"500"}}>{b.currency}</span><span style={{marginLeft:"8px",fontFamily:"Georgia,serif"}}>{b.amount.toLocaleString("en-US",{minimumFractionDigits:2})}</span></div>
                    <span className="text-gradient" style={{fontWeight:"500"}}>{fmt(b.usdValue)}</span>
                  </div>
                ))}
              </div>
              <div className="card" style={{padding:"24px"}}>
                <h3 className="font-display" style={{fontSize:"16px",fontWeight:"600",marginBottom:"16px"}}>🪙 Crypto <span className="text-muted" style={{fontSize:"12px",fontWeight:"400"}}>Live rates</span></h3>
                {crypto.length===0 ? <p className="text-muted text-sm">No crypto</p> : crypto.map((b:any)=>(
                  <div key={b.symbol} className="row-between" style={{padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                    <div><span style={{fontWeight:"500",color:coinColors[b.symbol]||"#fff"}}>{b.symbol}</span>
                      <span style={{marginLeft:"8px",fontFamily:"Georgia,serif"}}>{b.amount.toLocaleString("en-US",{minimumFractionDigits:4})}</span>
                      <span className="text-muted text-xs" style={{marginLeft:"6px"}}>@ ${b.price?.toLocaleString()}</span></div>
                    <span className="text-gradient">{fmt(b.usdValue)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card" style={{padding:"24px",marginBottom:"24px"}}>
              <h3 className="font-display" style={{fontSize:"16px",fontWeight:"600",marginBottom:"16px"}}>📤 Send</h3>
              {sendMsg&&<div className="badge badge-green" style={{marginBottom:"12px",padding:"10px",borderRadius:"8px",display:"block"}}>{sendMsg}</div>}
              {sendErr&&<div className="badge badge-red" style={{marginBottom:"12px",padding:"10px",borderRadius:"8px",display:"block"}}>{sendErr}</div>}
              <form onSubmit={sendFunds} className="row-wrap">
                <input type="text" value={to} onChange={e=>setTo(e.target.value)} placeholder="Email/Username" className="input" style={{flex:1,minWidth:"200px"}} required />
                <input type="number" step="0.01" min="0.01" value={sendAmt} onChange={e=>setSA(e.target.value)} placeholder="Amount" className="input" style={{width:"120px"}} required />
                <select value={sendCurr} onChange={e=>setSC(e.target.value)} className="input" style={{width:"90px"}}><option>USD</option><option>EUR</option><option>GBP</option><option>USDT</option><option>BTC</option><option>ETH</option><option>SOL</option></select>
                <button type="submit" className="btn btn-primary">Send</button>
              </form>
            </div>
            <div className="card" style={{padding:"24px"}}>
              <h3 className="font-display" style={{fontSize:"16px",fontWeight:"600",marginBottom:"16px"}}>📋 Transactions</h3>
              {txs.length===0 ? <p className="text-muted text-sm" style={{textAlign:"center",padding:"20px"}}>No transactions</p> : txs.slice(0,25).map((tx:any)=>(
                <div key={tx.id} className="row-between" style={{padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
                  <div><span style={{fontSize:"13px",fontWeight:"500",color:txColors[tx.type]||"#d4af37"}}>{txLabels[tx.type]||tx.type}</span>{tx.description&&<p className="text-xs text-muted">{tx.description}</p>}</div>
                  <div style={{textAlign:"right"}}><span style={{fontSize:"13px",color:"#22c55e"}}>+{Number(tx.amount).toLocaleString("en-US",{minimumFractionDigits:2})} {tx.currency}</span><p className="text-xs" style={{color:"#4b5563"}}>{new Date(tx.createdAt).toLocaleDateString()}</p></div>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab==="profile" && <div className="card fade-in" style={{padding:"32px",maxWidth:"520px"}}><h2 className="font-display text-xl" style={{marginBottom:"24px"}}>👤 Profile</h2>
          {[{l:"Name",v:user.name},{l:"Username",v:"@"+user.username,c:"#d4af37"},{l:"Email",v:user.email},{l:"KYC",v:kyc,c:kyc==="VERIFIED"?"#22c55e":kyc==="PENDING"?"#facc15":"#ef4444"}].map(i=>(
            <div key={i.l} style={{marginBottom:"16px"}}><label className="text-xs text-muted">{i.l}</label><div style={{padding:"12px 16px",background:"rgba(255,255,255,0.04)",borderRadius:"10px",fontSize:"14px",color:i.c||"#fff"}}>{i.v}</div></div>
          ))}
        </div>}
        {tab==="refer" && <div className="card fade-in" style={{padding:"32px",maxWidth:"520px"}}><h2 className="font-display text-xl" style={{marginBottom:"24px"}}>🔗 Referral</h2>
          <div className="card" style={{background:"rgba(212,175,55,0.06)",borderColor:"rgba(212,175,55,0.15)",padding:"24px",textAlign:"center",marginBottom:"20px"}}><p className="text-xs text-muted" style={{marginBottom:"8px"}}>Your Code</p><p className="font-display" style={{fontSize:"32px",fontWeight:"700"}}><span className="text-gradient">{refCode}</span></p></div>
          <div className="grid-2" style={{gap:"12px"}}><div className="stat"><div className="stat-value" style={{color:"#60a5fa"}}>0</div><div className="stat-label">Referrals</div></div><div className="stat"><div className="stat-value" style={{color:"#22c55e"}}>$0</div><div className="stat-label">Earned</div></div></div>
        </div>}
        {tab==="settings" && <div className="card fade-in" style={{padding:"32px",maxWidth:"520px"}}><h2 className="font-display text-xl" style={{marginBottom:"24px"}}>⚙️ Settings</h2>
          {pwMsg&&<div className={`badge ${pwMsg.includes("✅")?"badge-green":"badge-red"}`} style={{marginBottom:"16px",padding:"10px",borderRadius:"8px",display:"block"}}>{pwMsg}</div>}
          <form onSubmit={changePw} style={{display:"flex",flexDirection:"column",gap:"12px"}}>
            <input type="password" value={curPw} onChange={e=>setCP(e.target.value)} placeholder="Current password" className="input" required />
            <input type="password" value={newPw} onChange={e=>setNP(e.target.value)} placeholder="New password" className="input" required />
            <button type="submit" className="btn btn-primary">Change</button>
          </form>
        </div>}
      </main>
    </div>
  );
}
