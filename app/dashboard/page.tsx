"use client";import{useState,useEffect}from"react";import Link from "next/link";
export default function Dashboard(){
  const[u,setU]=useState<any>(null);const[wa,setWa]=useState<any[]>([]);const[to,setTo]=useState(0);const[tx,setTx]=useState<any[]>([]);const[kyc,setK]=useState("UNVERIFIED");const[tb,setTb]=useState("wallet")
  const[fC,setFC]=useState("USD");const[tC,setTC]=useState("EUR");const[sA,setSA]=useState("");const[sM,setSM]=useState("");const[sE,setSE]=useState("");const[cP,setCP]=useState("");const[nP,setNP]=useState("");const[pM,setPM]=useState("")
  const[dC,setDC]=useState("USD");const[ra,setRa]=useState<Record<string,number>>({});const[rc]=useState("GEM"+Math.random().toString(36).slice(2,8).toUpperCase())
  const ALL_C=["USD","EUR","GBP","INR","AED","SAR","JPY","CNY","AUD","CAD"];const SYM:Record<string,string>={USD:"$",EUR:"€",GBP:"£",INR:"₹",AED:"د.إ",SAR:"﷼",JPY:"¥",CNY:"¥",AUD:"A$",CAD:"C$"}
  useEffect(()=>{fetch("/api/auth/me").then(r=>r.json()).then(d=>{if(!d.id){window.location.href="/";return}setU(d);setK(d.kycStatus||"UNVERIFIED")});fetch("/api/balances").then(r=>r.json()).then(d=>{setWa(d.wallets||[]);setTo(d.totalUSD||0)});fetch("/api/transactions").then(r=>r.json()).then(d=>setTx(d.transactions||[]));fetch("/api/exchange-rates").then(r=>r.json()).then(d=>{const m:Record<string,number>={};(d.rates||[]).forEach((r:any)=>m[r.currency]=r.rate);setRa(m)}).catch(()=>{})},[])
  const xf=async()=>{if(fC===tC){setSE("Same currency");return}setSM("");setSE("");try{const r=await fetch("/api/transfer",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({fromCurrency:fC,toCurrency:tC,amount:parseFloat(sA)})});const d=await r.json();if(!r.ok)throw new Error(d.error);setSM("✅ Swapped!");setSA("")}catch(e:any){setSE(e.message)}}
  const cpw=async(e:any)=>{e.preventDefault();setPM("");try{const r=await fetch("/api/auth/password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({currentPassword:cP,newPassword:nP})});const d=await r.json();if(!r.ok)throw new Error(d.error);setPM("✅ Changed!");setCP("");setNP("")}catch(e:any){setPM(e.message)}}
  if(!u)return<div className="app"><div className="lo"/></div>
  const cv=(n:any)=>{if(n===undefined||n===null) return (SYM[dC]||dC)+" 0.00";const cu=dC;const r=ra[cu]||1;const v=cu==="USD"?n:n*r;return(SYM[cu]||cu)+" "+Number(v).toLocaleString("en-US",{minimumFractionDigits:2})}
  const tabs=[{k:"wallet",l:"💰 Wallet"},{k:"exchange",l:"🔄 Exchange"},{k:"profile",l:"👤 Profile"},{k:"settings",l:"⚙️ Settings"}]

  return(<div className="app">
    <div className="top"><div className="top-in">
      <span style={{fontWeight:700,fontSize:18}}>🌍 Global Gemini <span className="text-g">Wallet</span></span>
      <div style={{display:"flex",gap:16,alignItems:"center"}}>
        {tabs.map(t=>(<button key={t.k} onClick={()=>setTb(t.k)} className={`tab${tb===t.k?" act":""}`}>{t.l}</button>))}
        <button onClick={async()=>{await fetch("/api/auth/signout",{method:"POST"});window.location.href="/"}} className="btn btn-s btn-sm">Sign Out</button>
      </div>
    </div></div>
    <div className="main">
      {tb==="wallet"&&<div className="fi">
        <div className="row-between" style={{marginBottom:24,flexWrap:"wrap",gap:12}}>
          <div><h1 className="font-serif" style={{fontSize:28,fontWeight:700}}>Welcome, {u.name}</h1>
            <div className="row" style={{marginTop:8,gap:8,flexWrap:"wrap"}}>
              <p style={{fontSize:36,fontWeight:700}}><span className="text-g">{cv(to)}</span></p>
              <select value={dC} onChange={e=>setDC(e.target.value)} style={{padding:"4px 10px",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:6,color:"#FFD700",fontSize:13,fontWeight:600,outline:"none",cursor:"pointer"}}>{ALL_C.map(c=><option key={c} value={c}>{c}</option>)}</select>
              <span className="muted" style={{fontSize:14}}>total</span>
            </div>
          </div>
          <div className="row-wrap"><Link href="/wallet/deposit" className="btn btn-p">📥 Deposit</Link><Link href="/wallet/withdraw" className="btn btn-s">📤 Withdraw</Link><Link href="/kyc" className="btn btn-s btn-sm">📋 KYC</Link></div>
        </div>
        <div className="g4" style={{marginBottom:24}}>
          <div className="st"><div className="st-v"><span className="text-g">{cv(to)}</span></div><div className="st-l">Total Balance</div></div>
          <div className="st"><div className="st-v" style={{color:"#60a5fa"}}>{wa.length}</div><div className="st-l">Wallets</div></div>
          <div className="st"><div className="st-v" style={{color:"#22c55e"}}>{tx.length>0?tx[0]?.currency:"—"}</div><div className="st-l">Last Transaction</div></div>
          <div className="st"><div className="st-v" style={{color:"#a78bfa"}}>{kyc==="VERIFIED"?"✅ Active":kyc==="PENDING"?"⏳":"📋 Pending"}</div><div className="st-l">Account Status</div></div>
        </div>
        <div className="card" style={{padding:24,marginBottom:24}}>
          <h3 style={{fontSize:16,fontWeight:600,marginBottom:16}}>💼 Your Wallets</h3>
          <div className="g-auto">{wa.map((w:any)=>(
            <div key={w.id} className="crd2" style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:12,padding:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><span style={{fontWeight:600,fontSize:14}}>{w.currency}</span><p style={{fontSize:20,fontWeight:700,marginTop:4}}><span className="text-g">{w.balance.toLocaleString("en-US",{minimumFractionDigits:2})}</span></p></div>
              <div style={{textAlign:"right"}}><span className="muted" style={{fontSize:11}}>USD</span><p style={{fontSize:13,color:"#FFD700"}}>{cv(w.usdValue)}</p></div>
            </div>
          ))}</div>
        </div>
        <div className="card" style={{padding:24}}>
          <h3 style={{fontSize:16,fontWeight:600,marginBottom:16}}>📋 Transactions</h3>
          {tx.length===0?<p className="muted" style={{textAlign:"center",padding:20,fontSize:13}}>No transactions</p>:tx.slice(0,20).map((x:any)=>(
            <div key={x.id} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
              <div><span style={{fontSize:13,fontWeight:500}}>{x.type}</span>{x.description&&<p className="muted" style={{fontSize:11}}>{x.description}</p>}</div>
              <div style={{textAlign:"right"}}><span style={{fontSize:13,fontWeight:500,color:x.type==="ADMIN_FUNDING"?"#22c55e":"#FFD700"}}>{x.type==="ADMIN_FUNDING"?"+":"+"}{Number(x.amount).toLocaleString("en-US",{minimumFractionDigits:2})} {x.currency}</span><p className="muted" style={{fontSize:11}}>{new Date(x.createdAt).toLocaleDateString()}</p></div>
            </div>
          ))}
        </div>
      </div>}

      {tb==="exchange"&&<div className="card fi" style={{padding:32,maxWidth:500}}>
        <h2 className="font-serif" style={{fontSize:24,fontWeight:700,marginBottom:24}}>🔄 Currency Exchange</h2>
        {sM&&<div className="bg">{sM}</div>}{sE&&<div className="br">{sE}</div>}
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div><label className="muted text-xs">From</label>
            <div style={{display:"flex",gap:8,marginTop:4}}>
              <select value={fC} onChange={e=>setFC(e.target.value)} className="inp" style={{width:100}}>{ALL_C.map(c=><option key={c} value={c}>{c}</option>)}</select>
              <input type="number" step="0.01" value={sA} onChange={e=>setSA(e.target.value)} placeholder="0.00" className="inp" style={{flex:1}}/>
            </div>
          </div>
          <div style={{textAlign:"center"}}>
            <button onClick={()=>{setFC(tC);setTC(fC)}} style={{width:44,height:44,borderRadius:"50%",background:"rgba(255,215,0,0.1)",border:"1px solid rgba(255,215,0,0.2)",color:"#FFD700",fontSize:18,cursor:"pointer"}}>⇅</button>
          </div>
          <div><label className="muted text-xs">To</label>
            <select value={tC} onChange={e=>setTC(e.target.value)} className="inp" style={{marginTop:4}}>{ALL_C.map(c=><option key={c} value={c}>{c}</option>)}</select>
          </div>
          <button onClick={xf} className="btn btn-p" style={{width:"100%"}}>Exchange</button>
        </div>
      </div>}

      {tb==="profile"&&<div className="card fi" style={{padding:32,maxWidth:480}}>
        <h2 className="font-serif" style={{fontSize:24,fontWeight:700,marginBottom:24}}>👤 Profile</h2>
        {[{l:"Name",v:u.name},{l:"Username",v:"@"+u.username,c:"#FFD700"},{l:"Email",v:u.email},{l:"KYC",v:kyc,c:kyc==="VERIFIED"?"#22c55e":kyc==="PENDING"?"#facc15":"#ef4444"}].map(i=>(
          <div key={i.l} style={{marginBottom:16}}><label className="muted text-xs">{i.l}</label><div style={{padding:"12px 16px",background:"rgba(255,255,255,0.04)",borderRadius:10,fontSize:14,color:i.c||"#fff"}}>{i.v}</div></div>))}
      </div>}

      {tb==="settings"&&<div className="card fi" style={{padding:32,maxWidth:480}}>
        <h2 className="font-serif" style={{fontSize:24,fontWeight:700,marginBottom:24}}>⚙️ Settings</h2>
        {pM&&<div className={pM.includes("✅")?"bg":"br"}>{pM}</div>}
        <form onSubmit={cpw} style={{display:"flex",flexDirection:"column",gap:12}}>
          <input type="password" value={cP} onChange={e=>setCP(e.target.value)} placeholder="Current" className="inp" required/>
          <input type="password" value={nP} onChange={e=>setNP(e.target.value)} placeholder="New" className="inp" required/>
          <button type="submit" className="btn btn-p">Change Password</button>
        </form>
      </div>}
    </div></div>)
}
