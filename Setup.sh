#!/bin/bash
set -e

echo "🚀 Creating Global Gemini Wallet files..."

# ── Prisma Schema ──
cat > prisma/schema.prisma << 'EOF'
generator client { provider = "prisma-client-js" }
datasource db { provider = "postgresql" url = env("DATABASE_URL") }
model User { id String @id @default(cuid()) email String @unique name String password String role String @default("USER") kycStatus String @default("UNVERIFIED") kycFullName String? kycDocumentType String? kycDocumentNumber String? kycDocumentImage String? kycSubmittedAt DateTime? kycVerifiedAt DateTime? kycVerifiedBy String? kycRejectReason String? createdAt DateTime @default(now()) updatedAt DateTime @updatedAt wallet Wallet? deposits Deposit[] withdrawals WithdrawalRequest[] }
model Wallet { id String @id @default(cuid()) userId String @unique user User @relation(fields:[userId],references:[id],onDelete:Cascade) balances Balance[] createdAt DateTime @default(now()) }
model Balance { id String @id @default(cuid()) walletId String wallet Wallet @relation(fields:[walletId],references:[id],onDelete:Cascade) currency String amount Decimal @default(0) @db.Decimal(20,8) createdAt DateTime @default(now()) @@unique([walletId,currency]) }
model Transaction { id String @id @default(cuid()) walletId String wallet Wallet @relation(fields:[walletId],references:[id]) type String amount Decimal @db.Decimal(20,8) currency String description String? adminId String? createdAt DateTime @default(now()) }
model ExchangeRate { id String @id @default(cuid()) baseCurrency String @default("USD") targetCurrency String rate Decimal @db.Decimal(20,10) updatedAt DateTime @default(now()) @@unique([baseCurrency,targetCurrency]) }
model Deposit { id String @id @default(cuid()) userId String user User @relation(fields:[userId],references:[id]) amount Decimal @db.Decimal(20,8) currency String @default("USD") method String methodDetails Json? reference String? status String @default("PENDING") adminId String? createdAt DateTime @default(now()) processedAt DateTime? }
model WithdrawalRequest { id String @id @default(cuid()) userId String user User @relation(fields:[userId],references:[id]) amount Decimal @db.Decimal(20,8) currency String @default("USD") method String accountDetails Json status String @default("PENDING") adminId String? adminNote String? createdAt DateTime @default(now()) processedAt DateTime? }
EOF

# ── Seed ──
cat > prisma/seed.ts << 'SEED'
import { PrismaClient } from "@prisma/client"; import bcrypt from "bcryptjs";
const p = new PrismaClient();
async function main() {
  const pw = await bcrypt.hash("Admin@123456", 12);
  await p.user.upsert({ where:{email:"admin@globalgemini.com"}, update:{}, create:{email:"admin@globalgemini.com", name:"Admin", password:pw, role:"ADMIN", kycStatus:"VERIFIED", wallet:{create:{}}} });
  const w = await p.wallet.findFirst();
  if (w) { for (const c of ["USD","EUR","GBP","JPY","CHF","CAD","AUD","CNY","INR","BRL","MXN"]) { await p.balance.upsert({ where:{walletId_currency:{walletId:w.id,currency:c}}, update:{}, create:{walletId:w.id,currency:c,amount:1000000} }); } }
  const rates = [["USD",1],["EUR",0.92],["GBP",0.79],["JPY",149.5],["CHF",0.88],["CAD",1.36],["AUD",1.54],["CNY",7.24],["INR",83.5],["BRL",5.05],["MXN",17.8],["SGD",1.34],["NZD",1.64],["KRW",1330],["SEK",10.45],["NOK",10.7],["DKK",6.88],["TRY",30.2],["AED",3.67],["SAR",3.75],["HKD",7.82],["THB",35.8],["ZAR",18.9],["PLN",4.02],["RON",4.57],["HUF",358],["CZK",22.8],["ILS",3.68],["CLP",975],["PHP",56.2],["IDR",15700],["MYR",4.72],["VND",24600],["NGN",1550],["EGP",30.9],["KES",157],["COP",3925],["ARS",820],["UAH",38.2],["QAR",3.64],["OMR",0.385],["BHD",0.376],["KWD",0.307],["JOD",0.709],["TWD",31.8],["MAD",10.05],["PKR",278],["BDT",109.5]];
  for (const [t,r] of rates) { await p.exchangeRate.upsert({ where:{baseCurrency_targetCurrency:{baseCurrency:"USD",targetCurrency:t as string}}, update:{rate:r}, create:{baseCurrency:"USD",targetCurrency:t as string,rate:r} }); }
  console.log("✅ Seeded!");
}
main().catch(console.error).finally(()=>p.$disconnect());
SEED

# ── Lib files ──
mkdir -p lib
cat > lib/db.ts << 'EOF'
import { PrismaClient } from "@prisma/client";
const g = globalThis as any;
export const prisma = g.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") g.prisma = prisma;
EOF

cat > lib/auth.ts << 'AUTH'
import jwt from "jsonwebtoken"; import bcrypt from "bcryptjs"; import { cookies } from "next/headers";
const S = process.env.JWT_SECRET||"dev"; const N = "gg_token";
export const hashPassword = (p:string)=>bcrypt.hash(p,12);
export const verifyPassword = (p:string,h:string)=>bcrypt.compare(p,h);
export const signToken = (p:any)=>jwt.sign(p,S,{expiresIn:"7d"});
export const verifyToken = (t:string):any|null=>{try{return jwt.verify(t,S)}catch{return null}};
export const getSession = async ()=>{const t=(await cookies()).get(N)?.value; return t?verifyToken(t):null};
export const setCookie = (t:string)=>({name:N,value:t,httpOnly:true,secure:false,sameSite:"lax"as const,maxAge:604800,path:"/"});
export const clearCookie = ()=>({name:N,value:"",httpOnly:true,secure:false,sameSite:"lax"as const,maxAge:0,path:"/"});
export const requireAuth = async()=>{const s=await getSession();if(!s)throw new Error("Unauthorized");return s};
export const requireAdmin = async()=>{const s=await requireAuth();if(s.role!=="ADMIN")throw new Error("Forbidden");return s};
AUTH

# ── App Layout ──
cat > app/globals.css << 'CSS'
@tailwind base;@tailwind components;@tailwind utilities;
body{background:#0a0a0f;color:#fff;font-family:Inter,sans-serif}
.glass{background:rgba(255,255,255,0.04);backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,0.08);border-radius:16px}
.btn-primary{padding:10px 24px;background:linear-gradient(135deg,#d4af37,#b8942e);color:#000;font-weight:600;border-radius:12px;border:none;cursor:pointer;display:inline-flex;align-items:center;justify-content:center}
.btn-primary:hover{filter:brightness(1.1)}
.btn-secondary{padding:10px 24px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#fff;font-weight:500;border-radius:12px;cursor:pointer}
.input-luxe{width:100%;padding:12px 16px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:10px;color:#fff;outline:none}
.input-luxe:focus{border-color:rgba(212,175,55,0.5)}
.gold-text{background:linear-gradient(135deg,#d4af37,#f0d060);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
CSS

cat > app/layout.tsx << 'LAY'
import type { Metadata } from "next"; import "./globals.css";
export const metadata:Metadata={title:"Global Gemini Wallet",description:"Multi-Currency Platform"};
export default function RootLayout({children}:{children:React.ReactNode}){return(<html lang="en" data-theme="dark"><body>{children}</body></html>)}
LAY

# ── Landing Page ──
cat > app/page.tsx << 'LAND'
import Link from "next/link";
export default function Home(){return(<div className="min-h-screen flex flex-col items-center justify-center px-6 text-center"><h1 className="text-5xl font-bold mb-4">Global Gemini <span className="gold-text">Wallet</span></h1><p className="text-gray-400 mb-8 max-w-md">Multi-currency wallet with KYC, deposits, withdrawals, and admin panel</p><Link href="/sign-in" className="btn-primary">Admin Login</Link></div>)}
LAND

# ── Sign In ──
mkdir -p app/sign-in
cat > app/sign-in/page.tsx << 'SI'
"use client";import { useState } from "react";import { useRouter } from "next/navigation";
export default function SignIn(){const r=useRouter();const[e,setE]=useState("");const[p,setP]=useState("");const[err,setErr]=useState("");const[l,setL]=useState(false);
const h=async(e2:any)=>{e2.preventDefault();setErr("");setL(true);try{const res=await fetch("/api/auth/signin",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e,password:p})});const d=await res.json();if(!res.ok)throw new Error(d.error);if(d.user.role!=="ADMIN")throw new Error("Admin only");r.push("/admin");r.refresh()}catch(e2:any){setErr(e2.message)}finally{setL(false)}};
return(<div className="min-h-screen flex items-center justify-center px-4"><div className="glass p-8 max-w-sm w-full"><h2 className="text-xl font-bold text-center mb-6">🔐 Admin Sign In</h2>{err&&<div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-lg mb-3">{err}</div>}<form onSubmit={h} className="space-y-4"><input type="email" value={e} onChange={e=>setE(e.target.value)} className="input-luxe" placeholder="admin@globalgemini.com" required/><input type="password" value={p} onChange={e=>setP(e.target.value)} className="input-luxe" placeholder="Password" required/><button type="submit" disabled={l} className="btn-primary w-full disabled:opacity-50">{l?"...":"Sign In"}</button></form></div></div>)}
SI

# ── API Routes ──
mkdir -p app/api/auth/signin app/api/auth/signout app/api/auth/me app/api/balances app/api/transactions app/api/admin/fund app/api/admin/users app/api/health app/api/kyc/status app/api/admin/kyc/list app/api/admin/kyc/verify app/api/deposits/create app/api/deposits/history app/api/admin/deposits app/api/withdrawals/create app/api/withdrawals/history app/api/admin/withdrawals

cat > app/api/auth/signin/route.ts << 'SIN'
import { NextResponse } from "next/server"; import { prisma } from "@/lib/db"; import { verifyPassword,signToken,setCookie } from "@/lib/auth";
export async function POST(req:Request){try{const{email,password}=await req.json();const u=await prisma.user.findUnique({where:{email}});if(!u||!(await verifyPassword(password,u.password)))return NextResponse.json({error:"Invalid"},{status:401});const t=signToken({userId:u.id,email:u.email,role:u.role});const r=NextResponse.json({user:{id:u.id,email:u.email,name:u.name,role:u.role}});r.cookies.set(setCookie(t));return r}catch{return NextResponse.json({error:"Error"},{status:500})}}
SIN

cat > app/api/auth/me/route.ts << 'ME'
import { NextResponse } from "next/server"; import { prisma } from "@/lib/db"; import { getSession } from "@/lib/auth";
export async function GET(){try{const s=await getSession();if(!s)return NextResponse.json({error:"Unauthorized"},{status:401});const u=await prisma.user.findUnique({where:{id:s.userId},select:{id:true,email:true,name:true,role:true}});return NextResponse.json(u||{})}catch{return NextResponse.json({error:"Unauthorized"},{status:401})}}
ME

cat > app/api/auth/signout/route.ts << 'SO'
import { NextResponse } from "next/server"; import { clearCookie } from "@/lib/auth";
export async function POST(){const r=NextResponse.json({success:true});r.cookies.set(clearCookie());return r}
SO

cat > app/api/balances/route.ts << 'BAL'
import { NextResponse } from "next/server"; import { prisma } from "@/lib/db"; import { getSession } from "@/lib/auth";
export async function GET(){try{const s=await getSession();if(!s)return NextResponse.json({error:"Unauthorized"},{status:401});const w=await prisma.wallet.findUnique({where:{userId:s.userId},include:{balances:true}});if(!w)return NextResponse.json({balances:[],totalUSD:0});const rates=await prisma.exchangeRate.findMany({where:{baseCurrency:"USD"}});const rm=new Map(rates.map(r=>[r.targetCurrency,Number(r.rate)]));let t=0;const b=w.balances.filter(b=>Number(b.amount)>0).map(b=>{const r=rm.get(b.currency)||1;const u=b.currency==="USD"?Number(b.amount):Number(b.amount)/r;t+=u;return{currency:b.currency,amount:Number(b.amount),usdValue:u}});return NextResponse.json({balances:b,totalUSD:t})}catch{return NextResponse.json({error:"Error"},{status:500})}}
BAL

cat > app/api/transactions/route.ts << 'TX'
import { NextResponse } from "next/server"; import { prisma } from "@/lib/db"; import { getSession } from "@/lib/auth";
export async function GET(){try{const s=await getSession();if(!s)return NextResponse.json({error:"Unauthorized"},{status:401});const w=await prisma.wallet.findUnique({where:{userId:s.userId}});if(!w)return NextResponse.json({transactions:[]});const t=await prisma.transaction.findMany({where:{walletId:w.id},orderBy:{createdAt:"desc"},take:50});return NextResponse.json({transactions:t.map(t=>({id:t.id,type:t.type,amount:Number(t.amount),currency:t.currency,description:t.description,createdAt:t.createdAt.toISOString()}))})}catch{return NextResponse.json({error:"Error"},{status:500})}}
TX

cat > app/api/admin/users/route.ts << 'AUSR'
import { NextResponse } from "next/server"; import { prisma } from "@/lib/db"; import { requireAdmin } from "@/lib/auth";
export async function GET(){try{await requireAdmin();const u=await prisma.user.findMany({select:{id:true,email:true,name:true,role:true},orderBy:{createdAt:"desc"}});return NextResponse.json({users:u})}catch(e:any){return NextResponse.json({error:e.message},{status:401})}}
AUSR

cat > app/api/admin/fund/route.ts << 'FUND'
import { NextResponse } from "next/server"; import { prisma } from "@/lib/db"; import { requireAdmin } from "@/lib/auth";
export async function POST(req:Request){try{const a=await requireAdmin();const{email,currency,amount}=await req.json();const u=await prisma.user.findUnique({where:{email},include:{wallet:true}});if(!u||!u.wallet)return NextResponse.json({error:"User not found"},{status:404});const r=await prisma.$transaction(async(tx)=>{const b=await tx.balance.upsert({where:{walletId_currency:{walletId:u.wallet!.id,currency}},update:{amount:{increment:amount}},create:{walletId:u.wallet!.id,currency,amount}});await tx.transaction.create({data:{walletId:u.wallet!.id,type:"ADMIN_FUNDING",amount,currency,adminId:a.userId}});return b});return NextResponse.json({success:true,balance:{currency:r.currency,amount:Number(r.amount)}})}catch{return NextResponse.json({error:"Failed"},{status:500})}}
FUND

cat > app/api/health/route.ts << 'HLTH'
import { NextResponse } from "next/server"; import { prisma } from "@/lib/db";
export async function GET(){try{await prisma.$queryRaw`SELECT 1`;return NextResponse.json({status:"ok",timestamp:new Date().toISOString()})}catch{return NextResponse.json({status:"error"},{status:503})}}
HLTH

# ── Admin Dashboard ──
mkdir -p app/admin
cat > app/admin/page.tsx << 'ADMIN'
"use client";import { useState,useEffect } from "react";import { useRouter } from "next/navigation";
export default function AdminPage(){const r=useRouter();const[u,setU]=useState<any>(null);const[users,setUsers]=useState<any[]>([]);const[email,setE]=useState("");const[curr,setC]=useState("USD");const[amt,setA]=useState("");const[msg,setMsg]=useState("");const[err,setErr]=useState("");const[l,setL]=useState(false);
useEffect(()=>{fetch("/api/auth/me").then(r=>r.json()).then(d=>{if(d.role!=="ADMIN"){r.push("/sign-in");return}setU(d);fetch("/api/admin/users").then(r=>r.json()).then(d=>setUsers(d.users||[]))})},[r]);
const h=async(e:any)=>{e.preventDefault();setMsg("");setErr("");setL(true);try{const res=await fetch("/api/admin/fund",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,currency:curr,amount:parseFloat(amt)})});const d=await res.json();if(!res.ok)throw new Error(d.error);setMsg(`✅ Funded ${email}`);setA("")}catch(e:any){setErr(e.message)}finally{setL(false)}};
if(!u)return null;
return(<div className="min-h-screen p-6"><h1 className="text-2xl font-bold gold-text mb-6">⚡ Admin Dashboard</h1><div className="glass p-6 max-w-md mb-6"><h2 className="text-lg font-bold mb-4">💫 Fund User</h2>{msg&&<div className="bg-green-500/10 text-green-400 text-sm p-3 rounded-lg mb-3">{msg}</div>}{err&&<div className="bg-red-500/10 text-red-400 text-sm p-3 rounded-lg mb-3">{err}</div>}<form onSubmit={h} className="space-y-3"><select value={email} onChange={e=>setE(e.target.value)} className="input-luxe" required><option value="">Select user...</option>{users.filter((u:any)=>u.role!=="ADMIN").map((u:any)=><option key={u.id} value={u.email}>{u.name} ({u.email})</option>)}</select><div className="flex gap-3"><select value={curr} onChange={e=>setC(e.target.value)} className="input-luxe w-24"><option>USD</option><option>EUR</option><option>GBP</option></select><input type="number" step="0.01" value={amt} onChange={e=>setA(e.target.value)} className="input-luxe flex-1" placeholder="Amount" required/></div><button type="submit" disabled={l} className="btn-primary w-full">{l?"...":"💫 Fund"}</button></form></div><div className="glass p-6"><h2 className="text-lg font-bold mb-4">👥 Users</h2>{users.map((u:any)=><div key={u.id} className="flex justify-between p-2 border-b border-white/5"><span>{u.name} ({u.email})</span><span className="text-xs bg-white/10 px-2 py-1 rounded">{u.role}</span></div>)}</div></div>);}
ADMIN

# ── next.config.js (FIXED) ──
cat > next.config.js << 'NEXT'
/** @type {import('next').NextConfig} */
const nextConfig = {};
module.exports = nextConfig;
NEXT

# ── middleware.ts ──
cat > middleware.ts << 'MW'
import { NextResponse } from "next/server"; import type { NextRequest } from "next/server";
export function middleware(req:NextRequest){const{pathname}=req.nextUrl;if(pathname.startsWith("/_next")||pathname.startsWith("/favicon")||pathname.startsWith("/api/health"))return NextResponse.next();if(pathname.startsWith("/api/")&&!pathname.startsWith("/api/auth/signin")){const t=req.cookies.get("gg_token")?.value;if(!t)return NextResponse.json({error:"Unauthorized"},{status:401});return NextResponse.next()}if(!pathname.startsWith("/api/")&&pathname!=="/"&&!pathname.startsWith("/sign-in")){const t=req.cookies.get("gg_token")?.value;if(!t)return NextResponse.redirect(new URL("/sign-in",req.url))}return NextResponse.next()}
export const config={matcher:["/((?!_next/static|_next/image|favicon.ico).*)"]};
MW

# ── .env file ──
echo 'DATABASE_URL=""' > .env
echo 'JWT_SECRET="dev-secret-change-in-production"' >> .env

echo ""
echo "✅ All files created!"
echo ""
echo "Now run:"
echo "  1. npx prisma generate"
echo "  2. npx prisma db push"
echo "  3. npx tsx prisma/seed.ts"
echo "  4. npm run dev"
echo ""