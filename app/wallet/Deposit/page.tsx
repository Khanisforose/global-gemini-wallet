"use client"; import { useState } from "react"; import Link from "next/link";

const CRYPTO_ADDRESSES: Record<string, string> = {
  "BTC-Bitcoin": "14J6KfQzXyLV8gLUKMWch2S3hjJvkMy5Rc",
  "USDT-ERC20": "0xa7b97439665f545adb3bbc431ceb5053d4b46f49",
  "USDT-BEP20": "0xa7b97439665f545adb3bbc431ceb5053d4b46f49",
  "USDT-TRC20": "TLgjfeg8Mqw5ueo1CGC8eTb4EHysPMMA6S",
  "SOL-Solana": "FQy4HArVdBbZ87AHrbfdhSXRgyE5NUbrh6GaL8enMUeh",
  "ETH-ERC20": "0x09B0E6D01fb1DeDf172933cC1673aAf460353AAD",
};

const FIAT_METHODS = [
  { id:"UPI", label:"UPI", icon:"📱", details:"globalgemini@upi" },
  { id:"BANK_TRANSFER", label:"Bank Transfer", icon:"🏦", details:"Acc: 1234567890\nIFSC: GLOBAL001\nName: Global Gemini Wallet" },
  { id:"PAYPAL", label:"PayPal", icon:"🅿️", details:"payments@globalgeminiwallet.com" },
  { id:"STRIPE", label:"Stripe", icon:"💳", details:"Send payment to Stripe link" },
];

export default function DepositPage() {
  const [method, setM] = useState(""); const [asset, setA] = useState("USDT"); const [net, setNet] = useState("ERC20");
  const [amount, setAmt] = useState(""); const [step, setStep] = useState<"form"|"done">("form"); const [copied, setCopied] = useState("");

  const assets = [
    {s:"USDT", nets:["ERC20","BEP20","TRC20"]}, {s:"BTC", nets:["Bitcoin"]}, {s:"SOL", nets:["Solana"]},
    {s:"ETH", nets:["ERC20"]}
  ];
  const currentAsset = assets.find(a=>a.s===asset);
  const addrKey = `${asset}-${net}`;
  const address = CRYPTO_ADDRESSES[addrKey] || "Address not set";

  const copyAddr = async(txt:string, label:string) => {
    try { await navigator.clipboard.writeText(txt); setCopied(label); setTimeout(()=>setCopied(""), 2000); } catch {}
  };

  const BG="rgba(255,255,255,0.03)"; const BR="1px solid rgba(255,255,255,0.06)"; const IP={width:"100%",padding:"12px 14px",background:"#1a1a2e",border:BR,borderRadius:"10px",color:"#fff",fontSize:"14px",outline:"none",boxSizing:"border-box"as const};

  if(step==="done") return (
    <div className="min-h-screen" style={{background:"#0a0a0f",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
      <div className="card" style={{padding:"32px",maxWidth:"520px",width:"100%",textAlign:"center"}}>
        {method==="CRYPTO" ? (
          <>
            <div style={{fontSize:"48px",marginBottom:"12px"}}>₿</div>
            <h2 style={{fontSize:"20px",fontWeight:"700",fontFamily:"Georgia,serif",marginBottom:"8px"}}>Deposit {asset}</h2>
            <p style={{fontSize:"13px",color:"#6b7280",marginBottom:"16px"}}>Send ONLY <strong style={{color:"#d4af37"}}>{asset}</strong> on <strong style={{color:"#d4af37"}}>{net}</strong> network to this address:</p>
            <div style={{display:"flex",alignItems:"center",gap:"8px",background:"rgba(212,175,55,0.06)",border:"1px solid rgba(212,175,55,0.15)",borderRadius:"10px",padding:"12px",marginBottom:"16px",wordBreak:"break-all"}}>
              <code style={{fontSize:"12px",color:"#d4af37",flex:1,fontFamily:"monospace",textAlign:"left"}}>{address}</code>
              <button onClick={()=>copyAddr(address,"address")} style={{padding:"8px 12px",background:"rgba(212,175,55,0.12)",border:"none",borderRadius:"6px",color:"#d4af37",cursor:"pointer",fontSize:"12px",flexShrink:0}}>{copied==="address"?"✅ Copied!":"📋 Copy"}</button>
            </div>
            <div style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.15)",borderRadius:"8px",padding:"12px",marginBottom:"16px"}}>
              <p style={{color:"#ef4444",fontSize:"11px",margin:0}}>⚠️ Only send {asset} on the {net} network. Sending the wrong network will result in permanent loss.</p>
            </div>
            <p style={{color:"#facc15",fontSize:"12px",marginBottom:"16px"}}>⏳ After sending, contact admin to credit your wallet.</p>
            <Link href="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
          </>
        ) : (
          <>
            <div style={{fontSize:"48px",marginBottom:"12px"}}>📥</div>
            <h2 style={{fontSize:"20px",fontWeight:"700",fontFamily:"Georgia,serif",marginBottom:"8px"}}>Deposit via {method}</h2>
            <div style={{background:"rgba(212,175,55,0.06)",border:"1px solid rgba(212,175,55,0.15)",borderRadius:"10px",padding:"16px",marginBottom:"16px",textAlign:"left",fontSize:"13px",whiteSpace:"pre-line",lineHeight:"1.8"}}>
              {FIAT_METHODS.find(m=>m.id===method)?.details}
            </div>
            <p style={{color:"#facc15",fontSize:"12px",marginBottom:"16px"}}>⏳ Please send the amount and notify admin for verification.</p>
            <Link href="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{background:"#0a0a0f",padding:"24px 5%"}}>
      <div style={{maxWidth:"600px",margin:"0 auto"}}>
        <Link href="/dashboard" style={{color:"#6b7280",fontSize:"13px",textDecoration:"none"}}>← Dashboard</Link>
        <h1 className="font-display" style={{fontSize:"24px",fontWeight:"700",margin:"16px 0 24px"}}>📥 Deposit Funds</h1>

        <div className="card" style={{padding:"24px"}}>
          <h3 style={{fontSize:"14px",fontWeight:"600",marginBottom:"12px"}}>Select Method</h3>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(100px,1fr))",gap:"8px",marginBottom:"20px"}}>
            {[...FIAT_METHODS, {id:"CRYPTO",label:"Crypto",icon:"₿"}].map(m=>(
              <button key={m.id} onClick={()=>{setM(m.id);setStep("form")}} style={{padding:"12px",borderRadius:"10px",border:method===m.id?"2px solid #d4af37":"1px solid rgba(255,255,255,0.08)",background:method===m.id?"rgba(212,175,55,0.1)":"rgba(255,255,255,0.03)",color:"#fff",cursor:"pointer",fontSize:"12px",textAlign:"center"}}>
                <div style={{fontSize:"20px",marginBottom:"4px"}}>{m.icon}</div>{m.label}
              </button>
            ))}
          </div>

          {method==="CRYPTO" && (
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"16px"}}>
              <div><label className="text-xs text-muted" style={{display:"block",marginBottom:"4px"}}>Asset</label>
                <select value={asset} onChange={e=>{setA(e.target.value);const a=assets.find(x=>x.s===e.target.value);if(a)setNet(a.nets[0])}} className="input">
                  {assets.map(a=><option key={a.s} value={a.s}>{a.s}</option>)}
                </select>
              </div>
              <div><label className="text-xs text-muted" style={{display:"block",marginBottom:"4px"}}>Network</label>
                <select value={net} onChange={e=>setNet(e.target.value)} className="input">
                  {currentAsset?.nets.map(n=><option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
          )}

          <input type="number" step="0.01" min="1" value={amount} onChange={e=>setAmt(e.target.value)} placeholder={`Amount (${method==="CRYPTO"?asset:"USD"})`} className="input" style={{marginBottom:"16px"}} required />

          <button onClick={()=>setStep("done")} disabled={!method} className="btn btn-primary" style={{width:"100%"}}>
            Get Deposit Instructions
          </button>
        </div>
      </div>
    </div>
  );
}
