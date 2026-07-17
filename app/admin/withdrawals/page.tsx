"use client"; import { useState, useEffect } from "react"; import Link from "next/link";
export default function AdminWithdrawals() {
  const [wds, setW] = useState<any[]>([]);
  useEffect(() => { fetch("/api/admin/withdrawals").then(r=>r.json()).then(d=>setW(d.withdrawals||[])); }, []);
  const act = async(id:string,action:string) => { await fetch("/api/admin/withdrawals",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({withdrawalId:id,action})}); setW(w=>w.filter(x=>x.id!==id)); };
  return (
    <div style={{minHeight:"100vh",background:"#0a0a0f",color:"#fff",fontFamily:"Inter,sans-serif"}}>
      <div style={{borderBottom:"1px solid rgba(255,255,255,0.06)",padding:"14px 32px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <span style={{fontFamily:"Georgia,serif",fontSize:"18px",fontWeight:"600"}}>Global Gemini Wallet <span style={{fontSize:"10px",background:"rgba(212,175,55,0.12)",color:"#d4af37",padding:"2px 8px",borderRadius:"100px",marginLeft:"6px"}}>ADMIN</span></span>
        <Link href="/admin" style={{fontSize:"13px",color:"#6b7280",textDecoration:"none"}}>← Back</Link>
      </div>
      <div style={{maxWidth:"1200px",margin:"0 auto",padding:"24px 32px"}}>
        <h1 style={{fontSize:"24px",fontWeight:"bold",fontFamily:"Georgia,serif",marginBottom:"20px",background:"linear-gradient(135deg,#d4af37,#f0d060)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>📤 Withdrawal Requests</h1>
        {wds.length===0 ? <p style={{color:"#6b7280",textAlign:"center",padding:"40px"}}>No pending withdrawals</p> : wds.map(w=>(
          <div key={w.id} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"12px",padding:"16px",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"}}>
            <div><p style={{fontWeight:"500"}}>{w.user?.name} ({w.user?.email})</p><p style={{fontSize:"18px",fontWeight:"bold",color:"#ef4444",marginTop:"4px"}}>-{Number(w.amount).toLocaleString("en-US",{minimumFractionDigits:2})} {w.currency}</p><p style={{fontSize:"12px",color:"#6b7280",marginTop:"4px"}}>Method: {w.method} • {new Date(w.createdAt).toLocaleString()}</p></div>
            <div style={{display:"flex",gap:"8px"}}><button onClick={()=>act(w.id,"APPROVED")} style={{padding:"8px 16px",background:"rgba(34,197,94,0.12)",color:"#22c55e",border:"1px solid rgba(34,197,94,0.2)",borderRadius:"8px",cursor:"pointer",fontSize:"12px"}}>✅ Pay</button><button onClick={()=>act(w.id,"REJECTED")} style={{padding:"8px 16px",background:"rgba(239,68,68,0.12)",color:"#ef4444",border:"1px solid rgba(239,68,68,0.2)",borderRadius:"8px",cursor:"pointer",fontSize:"12px"}}>❌ Reject</button></div>
          </div>
        ))}
      </div>
    </div>
  );
}
