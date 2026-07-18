"use client"; import { useState } from "react"; import Link from "next/link";

const METHODS = [
  { id:"UPI", icon:"📱", label:"UPI", fields:[{k:"upiId",pl:"Enter UPI ID"}], info:"globalgemini@upi" },
  { id:"BANK", icon:"🏦", label:"Bank Transfer", fields:[{k:"accountName",pl:"Account Holder Name"},{k:"accountNumber",pl:"Account Number"},{k:"ifsc",pl:"IFSC Code"}], info:"NEFT/IMPS transfer" },
  { id:"PAYPAL", icon:"🅿️", label:"PayPal", fields:[{k:"paypalEmail",pl:"PayPal Email"}], info:"Withdraw to PayPal" },
  { id:"CRYPTO", icon:"₿", label:"Crypto", fields:[{k:"address",pl:"Wallet Address"},{k:"network",pl:"Network (ERC20/BEP20/TRC20/SOL)"}], info:"Send to external wallet" },
];

export default function WithdrawPage() {
  const [method, setM] = useState("UPI"); const [currency, setC] = useState("USD");
  const [amount, setA] = useState(""); const [details, setD] = useState<Record<string,string>>({});
  const [step, setStep] = useState<"form"|"done">("form"); const [err, setErr] = useState("");

  const curMethod = METHODS.find(m=>m.id===method)!;
  const IP={width:"100%",padding:"12px 14px",background:"#151525",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"10px",color:"#fff",fontSize:"14px",outline:"none",boxSizing:"border-box"as const};

  const submit = async(e:any) => {
    e.preventDefault(); setErr("");
    if (!amount || parseFloat(amount) < 1) { setErr("Minimum withdrawal: $1"); return; }
    setStep("done");
    // In production, this would call /api/withdrawals/create
  };

  if(step==="done") return(
    <div className="min-h-screen" style={{background:"#0a0a0f",display:"flex",alignItems:"center",justifyContent:"center",padding:"20px"}}>
      <div className="card" style={{padding:"32px",maxWidth:"440px",width:"100%",textAlign:"center"}}>
        <div style={{fontSize:"48px",marginBottom:"12px"}}>📤</div>
        <h2 style={{fontSize:"20px",fontWeight:"700",fontFamily:"Georgia,serif",marginBottom:"8px"}}>Withdrawal Submitted</h2>
        <p style={{fontSize:"13px",color:"#6b7280",marginBottom:"16px"}}>{amount} {currency} via {method}</p>
        <div style={{background:"rgba(250,204,21,0.08)",border:"1px solid rgba(250,204,21,0.15)",borderRadius:"8px",padding:"12px",marginBottom:"20px"}}>
          <p style={{color:"#facc15",fontSize:"12px",margin:0}}>⏳ Pending admin approval. You'll be notified once processed.</p>
        </div>
        <Link href="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{background:"#0a0a0f",padding:"24px 5%"}}>
      <div style={{maxWidth:"560px",margin:"0 auto"}}>
        <Link href="/dashboard" style={{color:"#6b7280",fontSize:"13px",textDecoration:"none"}}>← Dashboard</Link>
        <h1 className="font-display" style={{fontSize:"24px",fontWeight:"700",margin:"16px 0 24px"}}>📤 Withdraw Funds</h1>
        {err&&<div className="badge badge-red" style={{marginBottom:"16px",padding:"12px",borderRadius:"8px",display:"block"}}>{err}</div>}

        <div className="card" style={{padding:"24px"}}>
          <h3 style={{fontSize:"14px",fontWeight:"600",marginBottom:"12px"}}>Withdraw To</h3>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(90px,1fr))",gap:"8px",marginBottom:"20px"}}>
            {METHODS.map(m=>(
              <button key={m.id} onClick={()=>{setM(m.id);setD({})}} style={{padding:"12px",borderRadius:"10px",border:method===m.id?"2px solid #d4af37":"1px solid rgba(255,255,255,0.08)",background:method===m.id?"rgba(212,175,55,0.1)":"rgba(255,255,255,0.03)",color:"#fff",cursor:"pointer",fontSize:"12px",textAlign:"center"}}>
                <div style={{fontSize:"20px",marginBottom:"4px"}}>{m.icon}</div>{m.label}
              </button>
            ))}
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"16px"}}>
            <div><label className="text-xs text-muted" style={{display:"block",marginBottom:"4px"}}>Currency</label>
              <select value={currency} onChange={e=>setC(e.target.value)} className="input">
                <option>USD</option><option>EUR</option><option>GBP</option><option>USDT</option><option>BTC</option><option>ETH</option><option>SOL</option>
              </select>
            </div>
            <div><label className="text-xs text-muted" style={{display:"block",marginBottom:"4px"}}>Amount</label>
              <input type="number" step="0.01" min="1" value={amount} onChange={e=>setA(e.target.value)} placeholder="0.00" className="input" required />
            </div>
          </div>

          <div style={{marginBottom:"16px"}}>
            <label className="text-xs text-muted" style={{display:"block",marginBottom:"4px"}}>Account Details</label>
            {curMethod.fields.map(f=>(
              <input key={f.k} type="text" value={details[f.k]||""} onChange={e=>setD({...details,[f.k]:e.target.value})} placeholder={f.pl} className="input" style={{marginBottom:"8px"}} required />
            ))}
          </div>

          <button onClick={submit} className="btn btn-primary" style={{width:"100%"}}>Submit Withdrawal Request</button>
        </div>
      </div>
    </div>
  );
}
