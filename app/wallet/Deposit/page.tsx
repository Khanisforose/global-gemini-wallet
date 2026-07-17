"use client"; import { useState } from "react"; import Link from "next/link";
const METHODS = [
  { id:"UPI", label:"UPI", icon:"📱" }, { id:"BANK_TRANSFER", label:"Bank Transfer", icon:"🏦" },
  { id:"PAYPAL", label:"PayPal", icon:"🅿️" }, { id:"STRIPE", label:"Stripe", icon:"💳" },
  { id:"CRYPTO", label:"Crypto", icon:"₿" },
];
const CRYPTO_ASSETS = [
  { s:"USDT", nets:["ERC20","BEP20","TRC20","SOL"] }, { s:"BTC", nets:["Bitcoin"] },
  { s:"ETH", nets:["ERC20"] }, { s:"SOL", nets:["Solana"] },
];
export default function DepositPage() {
  const [method, setM] = useState("UPI"); const [asset, setA] = useState("USDT"); const [net, setNet] = useState("ERC20");
  const [amount, setAmt] = useState(""); const [step, setStep] = useState<"form"|"done">("form"); const [err, setErr] = useState("");
  const cryptoAddr: Record<string,string> = { "USDT-ERC20":"0x742d35Cc6634C0532925a3b844Bc3e1a1f8c5b3a", "USDT-BEP20":"0x742d35Cc6634C0532925a3b844Bc3e1a1f8c5b3a", "USDT-TRC20":"TXYZ1234567890abcdefghijklmnopqrstu", "USDT-SOL":"8xJ4NMz7g3G9kQ7s5dKj2m4n6p8q9r0s", "BTC-Bitcoin":"bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", "ETH-ERC20":"0x742d35Cc6634C0532925a3b844Bc3e1a1f8c5b3a", "SOL-Solana":"8xJ4NMz7g3G9kQ7s5dKj2m4n6p8q9r0s" };
  const currentAsset = CRYPTO_ASSETS.find(a=>a.s===asset);

  const submit = async(e:any) => { e.preventDefault(); setErr(""); setStep("done"); };
  const BG="rgba(255,255,255,0.03)"; const BR="1px solid rgba(255,255,255,0.06)"; const IP={width:"100%",padding:"12px 14px",background:"#1a1a2e",border:BR,borderRadius:"10px",color:"#fff",fontSize:"14px",outline:"none",boxSizing:"border-box"as const};

  if(step==="done") return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#0a0a0f",padding:"20px"}}>
      <div style={{background:BG,backdropFilter:"blur(24px)",border:BR,borderRadius:"16px",padding:"32px",maxWidth:"440px",width:"100%",textAlign:"center"}}>
        <div style={{fontSize:"40px",marginBottom:"12px"}}>📥</div>
        <h2 style={{fontSize:"18px",fontWeight:"bold",marginBottom:"8px"}}>Deposit Instructions</h2>
        {method==="CRYPTO" ? (
          <>
            <p style={{color:"#9ca3af",fontSize:"13px",marginBottom:"12px"}}>Send {amount||"your"} {asset} on the <strong style={{color:"#d4af37"}}>{net}</strong> network to:</p>
            <div style={{background:"rgba(212,175,55,0.08)",border:"1px solid rgba(212,175,55,0.15)",borderRadius:"10px",padding:"12px",marginBottom:"12px",wordBreak:"break-all",fontSize:"12px",fontFamily:"monospace",color:"#d4af37"}}>{cryptoAddr[`${asset}-${net}`]||"Address not found"}</div>
            <p style={{color:"#ef4444",fontSize:"11px"}}>⚠️ Only send {asset} on {net} network. Other networks will be lost.</p>
          </>
        ) : (
          <div style={{background:"rgba(212,175,55,0.08)",border:"1px solid rgba(212,175,55,0.15)",borderRadius:"10px",padding:"16px",marginBottom:"12px",textAlign:"left",fontSize:"13px"}}>
            <p style={{margin:"0 0 8px"}}><strong>Method:</strong> {method}</p>
            <p style={{margin:"0 0 8px"}}><strong>Amount:</strong> ${amount||"—"} USD</p>
            <p style={{margin:"0"}}><strong>Details:</strong> Please transfer to the account shown after admin approval.</p>
          </div>
        )}
        <p style={{color:"#facc15",fontSize:"12px",margin:"12px 0"}}>⏳ Pending admin verification</p>
        <Link href="/dashboard" style={{display:"inline-flex",padding:"10px 24px",background:"linear-gradient(135deg,#d4af37,#b8942e)",color:"#000",fontWeight:"600",fontSize:"13px",borderRadius:"10px",textDecoration:"none"}}>Back to Dashboard</Link>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:"#0a0a0f",color:"#fff",fontFamily:"Inter,sans-serif",padding:"20px"}}>
      <div style={{maxWidth:"500px",margin:"0 auto"}}>
        <Link href="/dashboard" style={{color:"#6b7280",fontSize:"13px",textDecoration:"none"}}>← Dashboard</Link>
        <h1 style={{fontSize:"24px",fontWeight:"bold",fontFamily:"Georgia,serif",margin:"16px 0 20px"}}>📥 Deposit Funds</h1>
        {err&&<div style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.15)",color:"#ef4444",fontSize:"12px",padding:"10px",borderRadius:"8px",marginBottom:"12px"}}>{err}</div>}
        <form onSubmit={submit} style={{background:BG,backdropFilter:"blur(24px)",border:BR,borderRadius:"16px",padding:"24px",display:"flex",flexDirection:"column",gap:"16px"}}>
          <div><label style={{fontSize:"12px",color:"#6b7280",display:"block",marginBottom:"8px"}}>Payment Method</label>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(80px,1fr))",gap:"8px"}}>
              {METHODS.map(m=>(<button key={m.id} type="button" onClick={()=>{setM(m.id);setA("USDT")}} style={{padding:"10px",borderRadius:"10px",border:method===m.id?"2px solid #d4af37":"1px solid rgba(255,255,255,0.1)",background:method===m.id?"rgba(212,175,55,0.1)":"rgba(255,255,255,0.03)",color:"#fff",cursor:"pointer",fontSize:"12px",textAlign:"center"}}><div style={{fontSize:"18px",marginBottom:"4px"}}>{m.icon}</div>{m.label}</button>))}
            </div>
          </div>
          {method==="CRYPTO" && (
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px"}}>
              <div><label style={{fontSize:"12px",color:"#6b7280",display:"block",marginBottom:"4px"}}>Asset</label>
                <select value={asset} onChange={e=>{setA(e.target.value);const a=CRYPTO_ASSETS.find(x=>x.s===e.target.value);if(a)setNet(a.nets[0])}} style={IP}>
                  {CRYPTO_ASSETS.map(a=><option key={a.s} value={a.s}>{a.s}</option>)}
                </select>
              </div>
              <div><label style={{fontSize:"12px",color:"#6b7280",display:"block",marginBottom:"4px"}}>Network</label>
                <select value={net} onChange={e=>setNet(e.target.value)} style={IP}>
                  {currentAsset?.nets.map(n=><option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
          )}
          <div><label style={{fontSize:"12px",color:"#6b7280",display:"block",marginBottom:"4px"}}>Amount ({method==="CRYPTO"?asset:"USD"})</label>
            <input type="number" step="0.01" min="1" value={amount} onChange={e=>setAmt(e.target.value)} placeholder="0.00" style={IP} required />
          </div>
          <button type="submit" style={{padding:"12px",background:"linear-gradient(135deg,#d4af37,#b8942e)",color:"#000",fontWeight:"600",fontSize:"14px",border:"none",borderRadius:"10px",cursor:"pointer"}}>Generate Deposit Instructions</button>
        </form>
      </div>
    </div>
  );
}
