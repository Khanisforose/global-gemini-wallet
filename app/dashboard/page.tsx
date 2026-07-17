"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [user, setU] = useState<any>(null);
  const [fiat, setF] = useState<any[]>([]);
  const [totalUSD, setTot] = useState(0);
  const [txs, setTxs] = useState<any[]>([]);
  const [kyc, setKyc] = useState("UNVERIFIED");

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (!d.id) { window.location.href = "/"; return; }
      setU(d); setKyc(d.kycStatus || "UNVERIFIED");
    });
    fetch("/api/balances").then(r => r.json()).then(d => {
      setF(d.balances || []);
      setTot(d.totalUSD || 0);
    });
    fetch("/api/transactions").then(r => r.json()).then(d => setTxs(d.transactions || []));
  }, []);

  if (!user) return <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]"><div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"/></div>;

  const fmt = (n: number) => "$" + n.toLocaleString("en-US", {minimumFractionDigits:2,maximumFractionDigits:2});

  return (
    <div style={{minHeight:"100vh",background:"#0a0a0f",color:"#fff",fontFamily:"Inter,sans-serif"}}>
      {/* Header */}
      <div style={{borderBottom:"1px solid rgba(255,255,255,0.08)",padding:"16px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",maxWidth:"1100px",margin:"0 auto"}}>
        <span style={{fontFamily:"Georgia,serif",fontSize:"18px",fontWeight:"600"}}>Global Gemini <span className="gold-text">Wallet</span></span>
        <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
          <span style={{fontSize:"13px",color:"#9ca3af"}}>{user.name}</span>
          <button onClick={async()=>{await fetch("/api/auth/signout",{method:"POST"});window.location.href="/";}} style={{fontSize:"13px",color:"#6b7280",background:"none",border:"none",cursor:"pointer"}}>Sign Out</button>
        </div>
      </div>

      <div style={{maxWidth:"1100px",margin:"0 auto",padding:"24px"}}>
        {/* Welcome + Total */}
        <div style={{marginBottom:"24px"}}>
          <h1 style={{fontSize:"24px",fontWeight:"bold",fontFamily:"Georgia,serif",marginBottom:"4px"}}>Welcome, {user.name}</h1>
          <p style={{fontSize:"28px",fontWeight:"bold",background:"linear-gradient(135deg,#d4af37,#f0d060)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
            {fmt(totalUSD)} <span style={{fontSize:"14px",color:"#6b7280",fontWeight:"400",WebkitTextFillColor:"#6b7280"}}>total USD</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{display:"flex",gap:"8px",marginBottom:"24px",flexWrap:"wrap"}}>
          {kyc !== "VERIFIED" ? (
            <Link href="/kyc" style={{display:"inline-flex",padding:"10px 20px",background: kyc==="PENDING" ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg,#d4af37,#b8942e)",color: kyc==="PENDING" ? "#e5e7eb" : "#000",fontWeight:"600",fontSize:"13px",borderRadius:"10px",textDecoration:"none",border: kyc==="PENDING" ? "1px solid rgba(255,255,255,0.1)" : "none"}}>
              {kyc === "PENDING" ? "⏳ KYC Pending" : "📋 Complete KYC"}
            </Link>
          ) : (
            <>
              <Link href="/wallet/deposit" style={{display:"inline-flex",padding:"10px 20px",background:"linear-gradient(135deg,#d4af37,#b8942e)",color:"#000",fontWeight:"600",fontSize:"13px",borderRadius:"10px",textDecoration:"none"}}>📥 Deposit</Link>
              <Link href="/wallet/withdraw" style={{display:"inline-flex",padding:"10px 20px",background:"rgba(255,255,255,0.05)",color:"#e5e7eb",fontWeight:"500",fontSize:"13px",borderRadius:"10px",textDecoration:"none",border:"1px solid rgba(255,255,255,0.1)"}}>📤 Withdraw</Link>
            </>
          )}
        </div>

        {/* Fiat Balances */}
        <div style={{background:"rgba(255,255,255,0.04)",backdropFilter:"blur(24px)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"16px",padding:"20px",marginBottom:"20px"}}>
          <h2 style={{fontSize:"16px",fontWeight:"600",fontFamily:"Georgia,serif",marginBottom:"12px"}}>💵 Fiat Currencies</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:"8px"}}>
            {fiat.map((b:any) => (
              <div key={b.currency} style={{background:"rgba(255,255,255,0.03)",borderRadius:"10px",padding:"12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><span style={{fontSize:"13px",fontWeight:"500"}}>{b.currency}</span><p style={{fontSize:"16px",fontWeight:"600",fontFamily:"Georgia,serif",marginTop:"2px"}}>{b.amount.toLocaleString("en-US",{minimumFractionDigits:2})}</p></div>
                <div style={{textAlign:"right"}}><span style={{fontSize:"11px",color:"#6b7280"}}>USD</span><p style={{fontSize:"13px",color:"#d4af37",fontWeight:"500"}}>{fmt(b.usdValue)}</p></div>
              </div>
            ))}
          </div>
        </div>

        {/* Crypto Section */}
        <div style={{background:"rgba(255,255,255,0.04)",backdropFilter:"blur(24px)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"16px",padding:"20px",marginBottom:"20px"}}>
          <h2 style={{fontSize:"16px",fontWeight:"600",fontFamily:"Georgia,serif",marginBottom:"12px"}}>🪙 Crypto</h2>
          <p style={{color:"#6b7280",fontSize:"13px"}}>Coming soon — Link your crypto wallets to see balances here.</p>
        </div>

        {/* Transactions */}
        <div style={{background:"rgba(255,255,255,0.04)",backdropFilter:"blur(24px)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"16px",padding:"20px"}}>
          <h2 style={{fontSize:"16px",fontWeight:"600",fontFamily:"Georgia,serif",marginBottom:"12px"}}>📋 Transactions</h2>
          {txs.length === 0 ? (
            <p style={{color:"#6b7280",fontSize:"13px",textAlign:"center",padding:"16px"}}>No transactions yet</p>
          ) : txs.slice(0,15).map((tx:any) => (
            <div key={tx.id} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
              <div><span style={{fontSize:"12px",fontWeight:"500",color: tx.type==="ADMIN_FUNDING"||tx.type==="DEPOSIT"?"#22c55e":"#d4af37"}}>{tx.type==="ADMIN_FUNDING"?"Credited":tx.type==="DEPOSIT"?"Deposit":tx.type}</span>{tx.description&&<p style={{fontSize:"11px",color:"#6b7280"}}>{tx.description}</p>}</div>
              <div style={{textAlign:"right"}}><span style={{fontSize:"13px",color:"#22c55e"}}>+{Number(tx.amount).toLocaleString("en-US",{minimumFractionDigits:2})} {tx.currency}</span><p style={{fontSize:"11px",color:"#4b5563"}}>{new Date(tx.createdAt).toLocaleDateString()}</p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
