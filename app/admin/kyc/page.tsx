"use client"; import { useState, useEffect } from "react"; import Link from "next/link";
export default function AdminKYC() {
  const [users, setU] = useState<any[]>([]);
  const [previewImg, setPI] = useState<string | null>(null);
  useEffect(() => { fetch("/api/admin/kyc/list").then(r=>r.json()).then(d=>setU(d.users||[])); }, []);
  const verify = async(id:string,action:string) => { await fetch("/api/admin/kyc/verify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:id,action})}); setU(u=>u.filter((x:any)=>x.id!==id)); };
  const BG = "rgba(255,255,255,0.03)"; const BR = "1px solid rgba(255,255,255,0.06)";

  return (
    <div style={{minHeight:"100vh",background:"#0a0a0f",color:"#fff",fontFamily:"Inter,sans-serif"}}>
      <div style={{borderBottom:BR,padding:"14px 32px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <span style={{fontFamily:"Georgia,serif",fontSize:"18px",fontWeight:"600"}}>Global Gemini <span className="gold-text">Wallet</span> <span style={{fontSize:"10px",background:"rgba(212,175,55,0.12)",color:"#d4af37",padding:"2px 8px",borderRadius:"100px",marginLeft:"6px"}}>ADMIN</span></span>
        <Link href="/admin" style={{fontSize:"13px",color:"#6b7280",textDecoration:"none"}}>← Back</Link>
      </div>
      <div style={{maxWidth:"1200px",margin:"0 auto",padding:"24px 32px"}}>
        <h1 style={{fontSize:"24px",fontWeight:"bold",fontFamily:"Georgia,serif",marginBottom:"20px",background:"linear-gradient(135deg,#d4af37,#f0d060)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>📋 KYC Verification Queue</h1>
        {users.length===0 ? <p style={{color:"#6b7280",textAlign:"center",padding:"40px"}}>No pending KYC requests</p> : <div style={{display:"grid",gap:"12px"}}>{users.map(u=>(
          <div key={u.id} style={{background:BG,backdropFilter:"blur(24px)",border:BR,borderRadius:"16px",padding:"20px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"16px"}}>
            <div><p style={{fontWeight:"600"}}>{u.kycFullName||u.name}</p><p style={{fontSize:"13px",color:"#9ca3af"}}>{u.email}</p><p style={{fontSize:"12px",color:"#6b7280",marginTop:"4px"}}>Document: {u.kycDocumentType} • #{u.kycDocumentNumber}</p><p style={{fontSize:"12px",color:"#6b7280"}}>Submitted: {new Date(u.kycSubmittedAt).toLocaleString()}</p></div>
            {u.kycDocumentImage && <img src={u.kycDocumentImage} alt="Doc" onClick={()=>setPI(u.kycDocumentImage)} style={{width:"80px",height:"60px",objectFit:"cover",borderRadius:"8px",cursor:"pointer",border:BR}} title="Click to enlarge"/>}
            <div style={{display:"flex",gap:"8px"}}>
              <button onClick={()=>verify(u.id,"VERIFIED")} style={{padding:"8px 16px",background:"rgba(34,197,94,0.12)",color:"#22c55e",border:"1px solid rgba(34,197,94,0.2)",borderRadius:"8px",cursor:"pointer",fontSize:"12px"}}>✅ Approve</button>
              <button onClick={()=>verify(u.id,"REJECTED")} style={{padding:"8px 16px",background:"rgba(239,68,68,0.12)",color:"#ef4444",border:"1px solid rgba(239,68,68,0.2)",borderRadius:"8px",cursor:"pointer",fontSize:"12px"}}>❌ Reject</button>
            </div>
          </div>
        ))}</div>}
        {/* Image Preview Modal */}
        {previewImg && <div onClick={()=>setPI(null)} style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,cursor:"pointer"}}>
          <img src={previewImg} alt="Full document" style={{maxWidth:"90%",maxHeight:"90%",borderRadius:"12px"}}/>
        </div>}
      </div>
    </div>
  );
}
