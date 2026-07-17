"use client"; import { useState } from "react"; import Link from "next/link";
const METHODS = [
  { id:"UPI", label:"UPI", icon:"📱", fields:[{k:"upiId",pl:"example@paytm"}] },
  { id:"BANK_ACCOUNT", label:"Bank Account", icon:"🏦", fields:[{k:"accountName",pl:"Full Name"},{k:"accountNumber",pl:"Account Number"},{k:"ifsc",pl:"IFSC Code"}] },
  { id:"PAYPAL", label:"PayPal", icon:"🅿️", fields:[{k:"email",pl:"PayPal Email"}] },
  { id:"CRYPTO", label:"Crypto", icon:"₿", fields:[{k:"address",pl:"Wallet Address"},{k:"network",pl:"Network (ERC20/BEP20/TRC20/SOL)"}] },
];
export default function WithdrawPage() {
  const [method, setM] = useState("UPI"); const [amount, setA] = useState(""); const [details, setD] = useState<Record<string,string>>({});
  const [step, setStep] = useState<"form"|"done">("form"); const [err, setErr] = useState("");
  const curMethod = METHODS.find(m=>m.id===method)!;
  const submit = async(e:any) => { e.preventDefault(); setErr(""); try { const r=await fetch("/api/withdrawals/create",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({amount:parseFloat(amount),currency:"USD",method,accountDetails:details})}); const d=await r.json(); if(!r.ok) throw new Error(d.error); setStep("done"); } catch(e:any) { setErr(e.message); } };
  const IP={width:"100%",padding:"12px 14px",background:"#1a1a2e",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"10px",color:"#fff",fontSize:"14px",outline:"none",boxSizing:"border-box"as const};
  if(step==="done") return(<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#0a0a0f"}}><div style={{background:"rgba(255,255,255,0.03)",backdropFilter:"blur(24px)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"16px",padding:"32px",textAlign:"center",maxWidth:"400px"}}><div style={{fontSize:"40px",marginBottom:"12px"}}>📤</div><h2 style={{fontSize:"18px",fontWeight:"bold",marginBottom:"8px"}}>Withdrawal Submitted</h2><p style={{color:"#9ca3af",fontSize:"13px",marginBottom:"16px"}}>Awaiting admin approval.</p><Link href="/dashboard" style={{padding:"10px 24px",background:"linear-gradient(135deg,#d4af37,#b8942e)",color:"#000",fontWeight:"600",fontSize:"13px",borderRadius:"10px",textDecoration:"none",display:"inline-flex"}}>Dashboard</Link></div></div>);
  return (
    <div style={{minHeight:"100vh",background:"#0a0a0f",color:"#fff",fontFamily:"Inter,sans-serif",padding:"20px"}}>
      <div style={{maxWidth:"500px",margin:"0 auto"}}>
        <Link href="/dashboard" style={{color:"#6b7280",fontSize:"13px",textDecoration:"none"}}>← Dashboard</Link>
        <h1 style={{fontSize:"24px",fontWeight:"bold",fontFamily:"Georgia,serif",margin:"16px 0 20px"}}>📤 Withdraw Funds</h1>
        {err&&<div style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.15)",color:"#ef4444",fontSize:"12px",padding:"10px",borderRadius:"8px",marginBottom:"12px"}}>{err}</div>}
        <form onSubmit={submit} style={{background:"rgba(255,255,255,0.03)",backdropFilter:"blur(24px)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"16px",padding:"24px",display:"flex",flexDirection:"column",gap:"12px"}}>
          <div><label style={{fontSize:"12px",color:"#6b7280",display:"block",marginBottom:"8px"}}>Withdraw To</label>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(80px,1fr))",gap:"8px"}}>
              {METHODS.map(m=>(<button key={m.id} type="button" onClick={()=>{setM(m.id);setD({})}} style={{padding:"10px",borderRadius:"10px",border:method===m.id?"2px solid #d4af37":"1px solid rgba(255,255,255,0.1)",background:method===m.id?"rgba(212,175,55,0.1)":"rgba(255,255,255,0.03)",color:"#fff",cursor:"pointer",fontSize:"12px",textAlign:"center"}}><div style={{fontSize:"18px",marginBottom:"4px"}}>{m.icon}</div>{m.label}</button>))}
            </div>
          </div>
          <input type="number" step="0.01" min="1" value={amount} onChange={e=>setA(e.target.value)} placeholder="Amount (USD)" style={IP} required />
          {curMethod.fields.map(f=>(<input key={f.k} type="text" value={details[f.k]||""} onChange={e=>setD({...details,[f.k]:e.target.value})} placeholder={f.pl} style={IP} required />))}
          <button type="submit" style={{padding:"12px",background:"linear-gradient(135deg,#d4af37,#b8942e)",color:"#000",fontWeight:"600",fontSize:"14px",border:"none",borderRadius:"10px",cursor:"pointer"}}>Submit Withdrawal</button>
        </form>
      </div>
    </div>
  );
}
