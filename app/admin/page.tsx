"use client"; import { useState, useEffect } from "react"; import Link from "next/link";
export default function AdminPage() {
  const [users, setU] = useState<any[]>([]); const [email, setE] = useState(""); const [curr, setC] = useState("USD"); const [amt, setA] = useState(""); const [msg, setMsg] = useState(""); const [err, setErr] = useState("");
  useEffect(() => { fetch("/api/auth/me").then(r=>r.json()).then(d => { if (d.role!=="ADMIN") { window.location.href="/"; return; } fetch("/api/admin/users").then(r=>r.json()).then(d=>setU(d.users||[])); }); }, []);
  const fund = async(e:any) => { e.preventDefault(); setMsg(""); setErr(""); try { const r=await fetch("/api/admin/fund",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,currency:curr,amount:parseFloat(amt)})}); const d=await r.json(); if(!r.ok) throw new Error(d.error); setMsg(`✅ Credited ${amt} ${curr} to ${email}`); setA(""); } catch(e:any) { setErr(e.message); } };
  const del = async(id:string) => { if(!confirm("Delete user?")) return; await fetch("/api/admin/user",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:id})}); setU(u=>u.filter((x:any)=>x.id!==id)); };
  const CURRENCIES = ["USD","EUR","GBP","JPY","CHF","CAD","AUD","CNY","INR","BRL","MXN","SGD","NZD","KRW","SEK","TRY","AED"];
  const BGCARD = "rgba(255,255,255,0.03)"; const BORDER = "1px solid rgba(255,255,255,0.06)"; const INP = {width:"100%",padding:"12px 14px",background:"#1a1a2e",border:BORDER,borderRadius:"10px",color:"#fff",fontSize:"14px",outline:"none"};
  return (
    <div style={{minHeight:"100vh",background:"#0a0a0f",color:"#fff",fontFamily:"Inter,sans-serif"}}>
      <div style={{borderBottom:BORDER,padding:"14px 32px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <span style={{fontFamily:"Georgia,serif",fontSize:"18px",fontWeight:"600"}}>Global Gemini <span style={{background:"linear-gradient(135deg,#d4af37,#f0d060)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Wallet</span> <span style={{fontSize:"10px",background:"rgba(212,175,55,0.12)",color:"#d4af37",padding:"2px 8px",borderRadius:"100px",marginLeft:"6px"}}>ADMIN</span></span>
        <button onClick={async()=>{await fetch("/api/auth/signout",{method:"POST"});window.location.href="/";}} style={{fontSize:"13px",color:"#6b7280",background:"none",border:"none",cursor:"pointer"}}>Sign Out</button>
      </div>
      <div style={{maxWidth:"1400px",margin:"0 auto",padding:"24px 32px"}}>
        <h1 style={{fontSize:"26px",fontWeight:"bold",fontFamily:"Georgia,serif",marginBottom:"20px",background:"linear-gradient(135deg,#d4af37,#f0d060)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>⚡ Admin Panel</h1>
        <div style={{display:"flex",gap:"8px",marginBottom:"24px",flexWrap:"wrap"}}>
          {[{l:"💫 Credit Users",p:"/admin"},{l:"📋 KYC Queue",p:"/admin/kyc"},{l:"📥 Deposits",p:"/admin/deposits"},{l:"📤 Withdrawals",p:"/admin/withdrawals"}].map(x=>(
            <Link key={x.p} href={x.p} style={{padding:"10px 20px",background:x.p==="/admin"?"linear-gradient(135deg,#d4af37,#b8942e)":"rgba(255,255,255,0.04)",color:x.p==="/admin"?"#000":"#e5e7eb",fontWeight:"600",fontSize:"13px",borderRadius:"10px",textDecoration:"none",border:x.p==="/admin"?"none":"1px solid rgba(255,255,255,0.08)"}}>{x.l}</Link>
          ))}
        </div>
        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:"12px",marginBottom:"24px"}}>
          {[{l:"Total Users",v:users.length,c:"#60a5fa"},{l:"KYC Pending",v:users.filter((u:any)=>u.kycStatus==="PENDING").length,c:"#facc15"},{l:"Verified",v:users.filter((u:any)=>u.kycStatus==="VERIFIED").length,c:"#22c55e"},{l:"Regular",v:users.filter((u:any)=>u.role==="USER").length,c:"#a78bfa"}].map(s=>(
            <div key={s.l} style={{background:BGCARD,backdropFilter:"blur(24px)",border:BORDER,borderRadius:"12px",padding:"16px",textAlign:"center"}}><div style={{fontSize:"24px",fontWeight:"bold",color:s.c}}>{s.v}</div><div style={{fontSize:"11px",color:"#6b7280",marginTop:"4px"}}>{s.l}</div></div>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:"20px"}}>
          {/* Credit Form */}
          <div style={{background:BGCARD,backdropFilter:"blur(24px)",border:BORDER,borderRadius:"16px",padding:"24px"}}>
            <h2 style={{fontSize:"16px",fontWeight:"600",fontFamily:"Georgia,serif",marginBottom:"16px"}}>💫 Credit User</h2>
            {msg&&<div style={{background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.15)",color:"#22c55e",fontSize:"12px",padding:"10px",borderRadius:"8px",marginBottom:"12px"}}>{msg}</div>}
            {err&&<div style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.15)",color:"#ef4444",fontSize:"12px",padding:"10px",borderRadius:"8px",marginBottom:"12px"}}>{err}</div>}
            <form onSubmit={fund} style={{display:"flex",flexDirection:"column",gap:"12px"}}>
              <select value={email} onChange={e=>setE(e.target.value)} style={INP} required><option value="">Select user...</option>{users.filter((u:any)=>u.role!=="ADMIN").map((u:any)=><option key={u.id} value={u.email}>{u.name} ({u.email})</option>)}</select>
              <div style={{display:"flex",gap:"8px"}}>
                <select value={curr} onChange={e=>setC(e.target.value)} style={{...INP,width:"100px"}}>{CURRENCIES.map(c=><option key={c} value={c}>{c}</option>)}</select>
                <input type="number" step="0.01" min="0.01" value={amt} onChange={e=>setA(e.target.value)} placeholder="Amount" style={{...INP,flex:1}} required />
              </div>
              <button type="submit" style={{width:"100%",padding:"12px",background:"linear-gradient(135deg,#d4af37,#b8942e)",color:"#000",fontWeight:"600",fontSize:"14px",border:"none",borderRadius:"10px",cursor:"pointer"}}>💫 Credit Now</button>
            </form>
          </div>
          {/* Users Table */}
          <div style={{background:BGCARD,backdropFilter:"blur(24px)",border:BORDER,borderRadius:"16px",padding:"20px"}}>
            <h2 style={{fontSize:"16px",fontWeight:"600",fontFamily:"Georgia,serif",marginBottom:"12px"}}>👥 Users</h2>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:"13px"}}>
                <thead><tr style={{color:"#6b7280",borderBottom:BORDER}}><th style={{textAlign:"left",padding:"8px"}}>Name</th><th style={{textAlign:"left",padding:"8px"}}>Email</th><th style={{textAlign:"center",padding:"8px"}}>KYC</th><th style={{textAlign:"center",padding:"8px"}}>Role</th><th style={{textAlign:"center",padding:"8px"}}>Action</th></tr></thead>
                <tbody>{users.map((u:any)=>(
                  <tr key={u.id} style={{borderBottom:BORDER}}><td style={{padding:"8px"}}>{u.name}</td><td style={{padding:"8px",color:"#9ca3af"}}>{u.email}</td>
                    <td style={{padding:"8px",textAlign:"center"}}><span style={{fontSize:"11px",padding:"2px 8px",borderRadius:"100px",background:u.kycStatus==="VERIFIED"?"rgba(34,197,94,0.15)":u.kycStatus==="PENDING"?"rgba(250,204,21,0.15)":"rgba(107,114,128,0.15)",color:u.kycStatus==="VERIFIED"?"#22c55e":u.kycStatus==="PENDING"?"#facc15":"#6b7280"}}>{u.kycStatus}</span></td>
                    <td style={{padding:"8px",textAlign:"center",color:"#6b7280"}}>{u.role}</td>
                    <td style={{padding:"8px",textAlign:"center"}}><button onClick={()=>del(u.id)} style={{fontSize:"11px",padding:"4px 12px",background:"rgba(239,68,68,0.12)",color:"#ef4444",border:"1px solid rgba(239,68,68,0.2)",borderRadius:"6px",cursor:"pointer"}}>Delete</button></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
