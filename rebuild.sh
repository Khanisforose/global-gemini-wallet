#!/bin/bash
set -e

# ============================================================
# GLOBAL GEMINI WALLET - COMPLETE REBUILD
# Luxury FinTech Multi-Currency Platform
# ============================================================

echo "🚀 Building Global Gemini Wallet..."

# ─── 1. PRISMA SCHEMA ───
cat > prisma/schema.prisma << 'PRISMA'
generator client { provider = "prisma-client-js" }
datasource db { provider = "postgresql" url = env("DATABASE_URL") }

model User {
  id            String   @id @default(cuid())
  email         String   @unique
  username      String   @unique
  name          String
  password      String
  role          String   @default("USER")
  country       String?
  phone         String?
  status        String   @default("ACTIVE")
  kycStatus     String   @default("UNVERIFIED")
  kycFullName   String?
  kycDocType    String?
  kycDocNumber  String?
  kycDocImage   String?
  kycSubmittedAt DateTime?
  kycVerifiedAt DateTime?
  kycVerifiedBy String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  wallets       Wallet[]
  transactions  Transaction[]
  notifications Notification[]
  audits        AuditLog[]
}

model Wallet {
  id        String    @id @default(cuid())
  userId    String
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  currency  String
  balance   Decimal   @default(0) @db.Decimal(20,8)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  @@unique([userId, currency])
}

model Transaction {
  id          String   @id @default(cuid())
  walletId    String?
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  type        String
  currency    String
  amount      Decimal  @db.Decimal(20,8)
  fee         Decimal  @default(0) @db.Decimal(20,8)
  fromWallet  String?
  toWallet    String?
  description String?
  status      String   @default("COMPLETED")
  adminId     String?
  createdAt   DateTime @default(now())
}

model ExchangeRate {
  id        String   @id @default(cuid())
  from      String
  to        String
  rate      Decimal  @db.Decimal(20,10)
  updatedAt DateTime @default(now())
  @@unique([from, to])
}

model Notification {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  title     String
  message   String
  read      Boolean  @default(false)
  createdAt DateTime @default(now())
}

model AuditLog {
  id        String   @id @default(cuid())
  adminId   String?
  admin     User?    @relation(fields: [adminId], references: [id])
  action    String
  details   String?
  ip        String?
  createdAt DateTime @default(now())
}
PRISMA

# ─── 2. SEED DATA ───
cat > prisma/seed.ts << 'SEED'
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const p = new PrismaClient();

const FIAT_CURRENCIES = ["USD", "EUR", "GBP", "INR", "AED", "SAR", "JPY", "CNY", "AUD", "CAD"];
const ALL_CURRENCIES = [...FIAT_CURRENCIES, "USDT", "BTC", "ETH", "SOL", "BNB"];

async function main() {
  // Admin
  const adminPw = await bcrypt.hash("Admin@123456", 12);
  const admin = await p.user.upsert({
    where: { email: "admin@globalgemini.com" },
    update: {},
    create: { email: "admin@globalgemini.com", username: "admin", name: "Admin", password: adminPw, role: "ADMIN", kycStatus: "VERIFIED", country: "AE" },
  });

  // Admin wallets
  for (const c of ALL_CURRENCIES) {
    await p.wallet.upsert({
      where: { userId_currency: { userId: admin.id, currency: c } },
      update: { balance: 1000000 },
      create: { userId: admin.id, currency: c, balance: 1000000 },
    });
  }

  // Exchange rates (USD base)
  const rates: Record<string, number> = {
    USD: 1, EUR: 0.92, GBP: 0.79, INR: 83.5, AED: 3.67, SAR: 3.75,
    JPY: 149.5, CNY: 7.24, AUD: 1.54, CAD: 1.36, USDT: 1, BTC: 0.000015,
    ETH: 0.00029, SOL: 0.0069, BNB: 0.0017,
  };
  for (const [to, rate] of Object.entries(rates)) {
    await p.exchangeRate.upsert({
      where: { from_to: { from: "USD", to } },
      update: { rate },
      create: { from: "USD", to, rate },
    });
  }

  console.log("✅ Seeded: admin@globalgemini.com / Admin@123456");
  console.log("✅ Currencies: " + ALL_CURRENCIES.join(", "));
}
main().catch(console.error).finally(() => p.$disconnect());
SEED

# ─── 3. LUXURY CSS ───
cat > app/globals.css << 'CSS'
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',sans-serif;background:#050505;color:#fff;overflow-x:hidden}

/* Animated Background */
.bg-o{position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;overflow:hidden}
.bg-o .o{position:absolute;border-radius:50%;filter:blur(150px)}
.bg-o .o1{width:700px;height:700px;background:radial-gradient(circle,rgba(255,215,0,0.06),transparent);top:-200px;right:-100px;animation:fl 14s ease-in-out infinite}
.bg-o .o2{width:500px;height:500px;background:radial-gradient(circle,rgba(201,162,39,0.04),transparent);bottom:-150px;left:-80px;animation:fl 18s ease-in-out infinite reverse}
.bg-o .o3{width:400px;height:400px;background:radial-gradient(circle,rgba(255,255,255,0.02),transparent);top:40%;left:60%;animation:fl 22s ease-in-out infinite 3s}
@keyframes fl{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-30px) scale(1.02)}}

.app{min-height:100vh;display:flex;flex-direction:column;position:relative;z-index:1}
.top{position:sticky;top:0;z-index:100;backdrop-filter:blur(24px);background:rgba(5,5,5,0.85);border-bottom:1px solid rgba(255,255,255,0.05)}
.top-in{display:flex;align-items:center;justify-content:space-between;padding:14px 4%;width:100%}
.main{flex:1;padding:28px 4%;width:100%;max-width:1400px;margin:0 auto}

/* Card - Ultra Premium Glassmorphism */
.card{background:linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01));backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid rgba(255,215,0,0.08);border-radius:20px;transition:all .4s cubic-bezier(0.4,0,0.2,1)}
.card:hover{border-color:rgba(255,215,0,0.15);transform:translateY(-2px);box-shadow:0 20px 40px rgba(0,0,0,0.3)}

/* Gold Accent */
.gold{color:#FFD700}
.gold-bg{background:linear-gradient(135deg,#FFD700,#C9A227)}
.gold-glow{box-shadow:0 0 30px rgba(255,215,0,0.15),0 0 60px rgba(255,215,0,0.05)}
.text-g{background:linear-gradient(135deg,#FFD700,#C9A227,#FFD700);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;background-size:200% 200%;animation:shimmer 3s ease-in-out infinite}
@keyframes shimmer{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}

/* Buttons */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:12px 28px;border-radius:12px;font-size:14px;font-weight:600;border:none;cursor:pointer;transition:all .3s cubic-bezier(0.4,0,0.2,1);text-decoration:none}
.btn-p{background:linear-gradient(135deg,#FFD700,#C9A227);color:#050505;box-shadow:0 4px 20px rgba(255,215,0,0.2)}
.btn-p:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(255,215,0,0.3)}
.btn-s{background:rgba(255,255,255,0.05);color:#e5e7eb;border:1px solid rgba(255,255,255,0.08)}
.btn-s:hover{background:rgba(255,255,255,0.08);border-color:rgba(255,215,0,0.2)}
.btn-sm{padding:8px 18px;font-size:12px;border-radius:8px}

/* Inputs */
.inp{width:100%;padding:14px 18px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;color:#fff;font-size:14px;outline:none;transition:all .3s}
.inp:focus{border-color:rgba(255,215,0,0.4);box-shadow:0 0 0 4px rgba(255,215,0,0.06)}
.inp::placeholder{color:#4b5563}
select.inp{cursor:pointer;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;padding-right:40px}
select.inp option{background:#111;color:#fff}

/* Typography */
.muted{color:#6b7280}
.text-xs{font-size:11px}
.text-sm{font-size:13px}
.font-serif{font-family:'Playfair Display',Georgia,serif}
.font-bold{font-weight:700}

/* Tabs */
.tab{padding:8px 0;background:none;border:none;border-bottom:2px solid transparent;color:#6b7280;font-size:13px;cursor:pointer;font-weight:500;transition:all .3s}
.tab:hover{color:#9ca3af}
.tab.act{color:#FFD700;border-bottom-color:#FFD700}

/* Stats */
.st{text-align:center;padding:24px;background:linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01));border:1px solid rgba(255,255,255,0.06);border-radius:16px}
.st-v{font-size:32px;font-weight:700}
.st-l{font-size:12px;color:#6b7280;margin-top:4px}

/* Grids */
.g2{display:grid;grid-template-columns:1fr 1fr;gap:24px}
.g3{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.g4{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.g-auto{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}

/* Animations */
@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.fi{animation:fadeIn .5s ease-out}
@keyframes countUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.cu{animation:countUp .6s ease-out}

/* Loading */
.lo{width:24px;height:24px;border:2px solid rgba(255,215,0,0.1);border-top-color:#FFD700;border-radius:50%;animation:sp .8s linear infinite;margin:60px auto}
@keyframes sp{to{transform:rotate(360deg)}}

/* Badge/Alert */
.bg{background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.15);color:#22c55e;font-size:13px;padding:12px;border-radius:10px;margin-bottom:12px}
.br{background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.15);color:#ef4444;font-size:13px;padding:12px;border-radius:10px;margin-bottom:12px}

@media(max-width:1024px){.g2,.g3,.g4{grid-template-columns:1fr}.main{padding:20px 4%}}
CSS

# ─── 4. LAYOUT ───
cat > app/layout.tsx << 'EOF'
import type{Metadata}from"next";import"./globals.css";
export const metadata:Metadata={title:"Global Gemini Wallet",description:"Premium Multi-Currency Wealth Platform"};
export default function RootLayout({children}:{children:React.ReactNode}){return(<html lang="en"><body><div className="bg-o"><div className="o o1"/><div className="o o2"/><div className="o o3"/></div>{children}</body></html>)}
EOF

# ─── 5. AUTH LIB ───
cat > lib/auth.ts << 'EOF'
import jwt from "jsonwebtoken";import bcrypt from "bcryptjs";import{cookies}from"next/headers";
const S=process.env.JWT_SECRET||"dev-secret";const N="gg_token";
export const hashPassword=(p:string)=>bcrypt.hash(p,12);
export const verifyPassword=(p:string,h:string)=>bcrypt.compare(p,h);
export const signToken=(p:any)=>jwt.sign(p,S,{expiresIn:"7d"});
export const verifyToken=(t:string):any|null=>{try{return jwt.verify(t,S)}catch{return null}};
export const getSession=async()=>{const t=(await cookies()).get(N)?.value;return t?verifyToken(t):null};
export const requireAuth=async()=>{const s=await getSession();if(!s)throw new Error("Unauthorized");return s};
export const requireAdmin=async()=>{const s=await requireAuth();if(s.role!=="ADMIN")throw new Error("Forbidden");return s};
export const setCookie=(token:string)=>({name:N,value:token,httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax"as const,maxAge:604800,path:"/"});
export const clearCookie=()=>({name:N,value:"",httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax"as const,maxAge:0,path:"/"});
EOF

cat > lib/db.ts << 'EOF'
import{PrismaClient}from"@prisma/client";const g=globalThis as any;export const prisma=g.prisma||new PrismaClient();if(process.env.NODE_ENV!=="production")g.prisma=prisma;
EOF

# ─── 6. API ROUTES ───
mkdir -p app/api/auth/signin app/api/auth/signup app/api/auth/me app/api/auth/signout
mkdir -p app/api/auth/password app/api/admin/users app/api/admin/fund app/api/admin/user
mkdir -p app/api/balances app/api/transactions app/api/transfer app/api/wallets app/api/exchange-rates
mkdir -p app/api/notifications app/api/admin/audit app/api/admin/rates app/api/kyc/status app/api/kyc/submit
mkdir -p app/api/admin/kyc/list app/api/admin/kyc/verify app/api/admin/deposits app/api/admin/withdrawals
mkdir -p app/api/deposits/create app/api/withdrawals/create app/api/health

# Sign Up
cat > app/api/auth/signup/route.ts << 'EOF'
import{NextResponse}from"next/server";import{prisma}from"@/lib/db";import{hashPassword}from"@/lib/auth";
const FIAT=["USD","EUR","GBP","INR","AED","SAR","JPY","CNY","AUD","CAD"];
export async function POST(req:Request){try{const{email,username,name,password,country,phone}=await req.json();if(!email||!username||!name||!password)return NextResponse.json({error:"All fields required"},{status:400});const e=await prisma.user.findUnique({where:{email}});if(e)return NextResponse.json({error:"Email exists"},{status:409});const u=await prisma.user.findUnique({where:{username}});if(u)return NextResponse.json({error:"Username taken"},{status:409});const h=await hashPassword(password);const user=await prisma.user.create({data:{email,username,name,password:h,country,phone}});for(const c of FIAT){await prisma.wallet.create({data:{userId:user.id,currency:c,balance:0}})}return NextResponse.json({success:true,message:"Account created! Please sign in."})}catch(e:any){return NextResponse.json({error:e.message},{status:500})}
EOF

# Sign In
cat > app/api/auth/signin/route.ts << 'EOF'
import{NextResponse}from"next/server";import{prisma}from"@/lib/db";import{verifyPassword,signToken,setCookie}from"@/lib/auth";
export async function POST(req:Request){try{const{email,password}=await req.json();const user=await prisma.user.findFirst({where:{OR:[{email},{username:email}]}});if(!user||!(await verifyPassword(password,user.password)))return NextResponse.json({error:"Invalid credentials"},{status:401});if(user.status==="DISABLED")return NextResponse.json({error:"Account disabled"},{status:403});const token=signToken({userId:user.id,email:user.email,role:user.role});const res=NextResponse.json({user:{id:user.id,email:user.email,name:user.name,role:user.role,username:user.username}});res.cookies.set(setCookie(token));return res}catch{return NextResponse.json({error:"Error"},{status:500})}
EOF

# Me
cat > app/api/auth/me/route.ts << 'EOF'
import{NextResponse}from"next/server";import{prisma}from"@/lib/db";import{getSession}from"@/lib/auth";
export async function GET(){try{const s=await getSession();if(!s)return NextResponse.json({error:"Unauthorized"},{status:401});const u=await prisma.user.findUnique({where:{id:s.userId},select:{id:true,email:true,username:true,name:true,role:true,kycStatus:true,status:true,country:true,phone:true}});return NextResponse.json(u||{})}catch{return NextResponse.json({error:"Unauthorized"},{status:401})}
EOF

# Sign Out
cat > app/api/auth/signout/route.ts << 'EOF'
import{NextResponse}from"next/server";import{clearCookie}from"@/lib/auth";
export async function POST(){const r=NextResponse.json({success:true});r.cookies.set(clearCookie());return r}
EOF

# Change Password
cat > app/api/auth/password/route.ts << 'EOF'
import{NextResponse}from"next/server";import{prisma}from"@/lib/db";import{getSession,hashPassword,verifyPassword}from"@/lib/auth";
export async function POST(req:Request){try{const s=await getSession();if(!s)return NextResponse.json({error:"Unauthorized"},{status:401});const{currentPassword,newPassword}=await req.json();const user=await prisma.user.findUnique({where:{id:s.userId}});if(!user||!(await verifyPassword(currentPassword,user.password)))return NextResponse.json({error:"Wrong password"},{status:400});await prisma.user.update({where:{id:s.userId},data:{password:await hashPassword(newPassword)}});return NextResponse.json({success:true})}catch{return NextResponse.json({error:"Failed"},{status:500})}
EOF

# Balances
cat > app/api/balances/route.ts << 'EOF'
import{NextResponse}from"next/server";import{prisma}from"@/lib/db";import{getSession}from"@/lib/auth";
export async function GET(){try{const s=await getSession();if(!s)return NextResponse.json({error:"Unauthorized"},{status:401});const wallets=await prisma.wallet.findMany({where:{userId:s.userId},orderBy:{currency:"asc"}});const rates=await prisma.exchangeRate.findMany({where:{from:"USD"}});const rm=new Map(rates.map(r=>[r.to,Number(r.rate)]));let total=0;const w=wallets.map(w=>{const rate=rm.get(w.currency)||1;const usd=w.currency==="USD"?Number(w.balance):Number(w.balance)/rate;total+=usd;return{id:w.id,currency:w.currency,balance:Number(w.balance),usdValue:usd}});return NextResponse.json({wallets,totalUSD:total})}catch{return NextResponse.json({error:"Error"},{status:500})}
EOF

# Transactions
cat > app/api/transactions/route.ts << 'EOF'
import{NextResponse}from"next/server";import{prisma}from"@/lib/db";import{getSession}from"@/lib/auth";
export async function GET(){try{const s=await getSession();if(!s)return NextResponse.json({error:"Unauthorized"},{status:401});const t=await prisma.transaction.findMany({where:{userId:s.userId},orderBy:{createdAt:"desc"},take:50});return NextResponse.json({transactions:t.map(t=>({id:t.id,type:t.type,currency:t.currency,amount:Number(t.amount),fee:Number(t.fee),description:t.description,status:t.status,createdAt:t.createdAt}))})}catch{return NextResponse.json({error:"Error"},{status:500})}
EOF

# Transfer
cat > app/api/transfer/route.ts << 'EOF'
import{NextResponse}from"next/server";import{prisma}from"@/lib/db";import{getSession}from"@/lib/auth";
export async function POST(req:Request){try{const s=await getSession();if(!s)return NextResponse.json({error:"Unauthorized"},{status:401});const{fromCurrency,toCurrency,amount}=await req.json();if(!fromCurrency||!toCurrency||!amount||amount<=0)return NextResponse.json({error:"Invalid"},{status:400});if(fromCurrency===toCurrency)return NextResponse.json({error:"Same currency"},{status:400});const fromWallet=await prisma.wallet.findUnique({where:{userId_currency:{userId:s.userId,currency:fromCurrency}}});if(!fromWallet||Number(fromWallet.balance)<amount)return NextResponse.json({error:"Insufficient"},{status:400});const rate=await prisma.exchangeRate.findUnique({where:{from_to:{from:fromCurrency,to:toCurrency}}});if(!rate)return NextResponse.json({error:"Rate not found"},{status:404});const received=Number(amount)*Number(rate.rate);await prisma.$transaction(async(tx)=>{await tx.wallet.update({where:{userId_currency:{userId:s.userId,currency:fromCurrency}},data:{balance:{decrement:amount}}});await tx.wallet.upsert({where:{userId_currency:{userId:s.userId,currency:toCurrency}},update:{balance:{increment:received}},create:{userId:s.userId,currency:toCurrency,balance:received}});await tx.transaction.create({data:{userId:s.userId,type:"EXCHANGE",currency:fromCurrency,amount,description:`Swapped ${amount} ${fromCurrency} → ${received.toFixed(2)} ${toCurrency}`,fromWallet:fromCurrency,toWallet:toCurrency}})});return NextResponse.json({success:true,received})}catch(e:any){return NextResponse.json({error:e.message},{status:500})}
EOF

# Exchange Rates
cat > app/api/exchange-rates/route.ts << 'EOF'
import{NextResponse}from"next/server";import{prisma}from"@/lib/db";
export async function GET(){try{const rates=await prisma.exchangeRate.findMany({where:{from:"USD"},orderBy:{to:"asc"}});return NextResponse.json({rates:rates.map(r=>({currency:r.to,rate:Number(r.rate)}))})}catch{return NextResponse.json({error:"Error"},{status:500})}
EOF

# Admin Users
cat > app/api/admin/users/route.ts << 'EOF'
import{NextResponse}from"next/server";import{prisma}from"@/lib/db";import{requireAdmin}from"@/lib/auth";
export async function GET(){try{await requireAdmin();const users=await prisma.user.findMany({select:{id:true,email:true,username:true,name:true,role:true,kycStatus:true,status:true,country:true,createdAt:true},orderBy:{createdAt:"desc"}});return NextResponse.json({users})}catch(e:any){return NextResponse.json({error:e.message},{status:401})}
EOF

# Admin Fund
cat > app/api/admin/fund/route.ts << 'EOF'
import{NextResponse}from"next/server";import{prisma}from"@/lib/db";import{requireAdmin}from"@/lib/auth";
export async function POST(req:Request){try{const admin=await requireAdmin();const{userId,currency,amount,description}=await req.json();if(!userId||!currency||!amount)return NextResponse.json({error:"Missing fields"},{status:400});const user=await prisma.user.findUnique({where:{id:userId}});if(!user)return NextResponse.json({error:"User not found"},{status:404});await prisma.$transaction(async(tx)=>{await tx.wallet.upsert({where:{userId_currency:{userId,currency}},update:{balance:{increment:amount}},create:{userId,currency,balance:amount}});await tx.transaction.create({data:{userId,type:"ADMIN_FUNDING",currency,amount,description:description||"Deposited by admin",adminId:admin.userId}})});return NextResponse.json({success:true})}catch(e:any){return NextResponse.json({error:e.message},{status:500})}
EOF

# Admin User Actions
cat > app/api/admin/user/route.ts << 'EOF'
import{NextResponse}from"next/server";import{prisma}from"@/lib/db";import{requireAdmin}from"@/lib/auth";
export async function DELETE(req:Request){try{await requireAdmin();const{userId}=await req.json();await prisma.user.delete({where:{id:userId}});return NextResponse.json({success:true})}catch(e:any){return NextResponse.json({error:e.message},{status:500})}
export async function PATCH(req:Request){try{const admin=await requireAdmin();const{userId,action}=await req.json();if(action==="FREEZE")await prisma.user.update({where:{id:userId},data:{status:"FROZEN"}});else if(action==="UNFREEZE")await prisma.user.update({where:{id:userId},data:{status:"ACTIVE"}});else if(action==="DISABLE")await prisma.user.update({where:{id:userId},data:{status:"DISABLED"}});else if(action==="ENABLE")await prisma.user.update({where:{id:userId},data:{status:"ACTIVE"}});return NextResponse.json({success:true})}catch(e:any){return NextResponse.json({error:e.message},{status:500})}
EOF

# Admin Audit
cat > app/api/admin/audit/route.ts << 'EOF'
import{NextResponse}from"next/server";import{prisma}from"@/lib/db";import{requireAdmin}from"@/lib/auth";
export async function GET(){try{await requireAdmin();const logs=await prisma.auditLog.findMany({orderBy:{createdAt:"desc"},take:100,include:{admin:{select:{name:true,email:true}}}});return NextResponse.json({logs})}catch(e:any){return NextResponse.json({error:e.message},{status:401})}
EOF

# Health
cat > app/api/health/route.ts << 'EOF'
import{NextResponse}from"next/server";import{prisma}from"@/lib/db";
export async function GET(){try{await prisma.$queryRaw`SELECT 1`;return NextResponse.json({status:"ok",timestamp:new Date().toISOString()})}catch{return NextResponse.json({status:"error"},{status:503})}
EOF

# ─── 7. LANDING PAGE ───
cat > app/page.tsx << 'EOF'
"use client";import{useState}from"react";
export default function Home(){const[pg,setPg]=useState("home");const[lg,setLg]=useState(true);const[em,setEm]=useState("");const[pw,setPw]=useState("");const[nm,setNm]=useState("");const[us,setUs]=useState("");const[ph,setPh]=useState("");const[cy,setCy]=useState("");const[er,setEr]=useState("");const[msg,setMsg]=useState("");const[ld,setLd]=useState(false);const[se,setSe]=useState("")
const hL=async(e:any)=>{e.preventDefault();setEr("");setLd(true);try{const r=await fetch("/api/auth/signin",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:em,password:pw})});const d=await r.json();if(!r.ok)throw new Error(d.error);window.location.href=d.user.role==="ADMIN"?"/admin":"/dashboard"}catch(e:any){setEr(e.message)}finally{setLd(false)}}
const hR=async(e:any)=>{e.preventDefault();setEr("");setLd(true);try{const r=await fetch("/api/auth/signup",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:se,username:us,name:nm,password:pw,country:cy,phone:ph})});const d=await r.json();if(!r.ok)throw new Error(d.error);setMsg("✅ Account created! Please sign in.");setLg(true);setEm(se);setPw("")}catch(e:any){setEr(e.message)}finally{setLd(false)}}
const nav=[{k:"home",l:"Home"},{k:"features",l:"Features"},{k:"currencies",l:"Currencies"},{k:"about",l:"About"}]
const IP={width:"100%",padding:"14px 18px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"12px",color:"#fff",fontSize:"14px",outline:"none",boxSizing:"border-box"as const}
return(<div style={{minHeight:"100vh",background:"#050505",color:"#fff",fontFamily:"Inter,sans-serif"}}>
<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 4%",borderBottom:"1px solid rgba(255,255,255,0.05)",backdropFilter:"blur(24px)",background:"rgba(5,5,5,0.85)",position:"sticky",top:0,zIndex:100}}>
<span style={{fontWeight:700,fontSize:18}}>🌍 Global Gemini <span className="text-g">Wallet</span></span>
<div style={{display:"flex",gap:24,alignItems:"center"}}>{nav.map(n=>(<button key={n.k} onClick={()=>setPg(n.k)} style={{fontSize:14,color:pg===n.k?"#FFD700":"#9ca3af",background:"none",border:"none",cursor:"pointer",fontWeight:pg===n.k?600:400}}>{n.l}</button>))}
<button onClick={()=>{setPg("home");setLg(true)}} className="btn btn-s btn-sm">Sign In</button>
<button onClick={()=>{setPg("home");setLg(false)}} className="btn btn-p btn-sm">Get Started</button>
</div></div>

{pg==="home"&&<div style={{display:"flex",minHeight:"calc(100vh - 70px)"}}>
<div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"60px 4%",background:"radial-gradient(ellipse at 30% 50%,rgba(255,215,0,0.04) 0%,transparent 60%)"}}>
<div style={{maxWidth:540}}>
<div style={{display:"inline-flex",padding:"6px 16px",background:"rgba(255,215,0,0.1)",border:"1px solid rgba(255,215,0,0.15)",borderRadius:100,fontSize:12,color:"#FFD700",marginBottom:24}}>✦ Premium Multi-Currency Platform</div>
<h1 className="font-serif" style={{fontSize:56,fontWeight:700,lineHeight:"1.1",marginBottom:16}}>Your Global<br/><span className="text-g">Financial Command Center</span></h1>
<p style={{fontSize:15,color:"#6b7280",lineHeight:"1.8",marginBottom:32}}>Manage 170+ currencies, exchange at live rates, send money globally, and track your portfolio — all from one premium platform.</p>
<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:32}}>
{[{v:"170+",l:"Currencies"},{v:"10+",l:"Payment Methods"},{v:"100%",l:"Secure"},{v:"24/7",l:"Support"}].map(s=>(<div key={s.l} style={{padding:16,background:"rgba(255,255,255,0.03)",borderRadius:12,textAlign:"center"}}><div style={{fontSize:22,fontWeight:700}}><span className="text-g">{s.v}</span></div><div style={{fontSize:11,color:"#6b7280",marginTop:4}}>{s.l}</div></div>))}
</div>
<div style={{display:"flex",gap:16,fontSize:13}}>
<span style={{display:"flex",alignItems:"center",gap:6}}><span style={{color:"#22c55e"}}>✓</span> KYC Verified</span>
<span style={{display:"flex",alignItems:"center",gap:6}}><span style={{color:"#22c55e"}}>✓</span> Live Rates</span>
<span style={{display:"flex",alignItems:"center",gap:6}}><span style={{color:"#22c55e"}}>✓</span> Premium Security</span>
</div></div></div>
<div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"60px 4%"}}>
<div style={{width:"100%",maxWidth:420}}>
<div style={{display:"flex",marginBottom:24,gap:12}}>
<button onClick={()=>{setLg(true);setEr("");setMsg("")}} style={{flex:1,padding:12,borderRadius:12,border:"none",background:lg?"linear-gradient(135deg,#FFD700,#C9A227)":"rgba(255,255,255,0.05)",color:lg?"#000":"#fff",fontSize:14,fontWeight:600,cursor:"pointer"}}>🔐 Sign In</button>
<button onClick={()=>{setLg(false);setEr("");setMsg("")}} style={{flex:1,padding:12,borderRadius:12,border:"none",background:!lg?"linear-gradient(135deg,#FFD700,#C9A227)":"rgba(255,255,255,0.05)",color:!lg?"#000":"#fff",fontSize:14,fontWeight:600,cursor:"pointer"}}>✨ Register</button>
</div>
{er&&<div className="br">{er}</div>}{msg&&<div className="bg">{msg}</div>}
{lg?(<form onSubmit={hL} style={{display:"flex",flexDirection:"column",gap:14}}>
<input type="text" value={em} onChange={e=>setEm(e.target.value)} placeholder="Email or Username" style={IP} required/>
<input type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="Password" style={IP} required/>
<button type="submit" disabled={ld} className="btn btn-p" style={{width:"100%",padding:14,fontSize:15}}>{ld?"...":"🔐 Sign In"}</button>
</form>):(<form onSubmit={hR} style={{display:"flex",flexDirection:"column",gap:12}}>
<input type="text" value={nm} onChange={e=>setNm(e.target.value)} placeholder="Full Name" style={IP} required/>
<input type="text" value={us} onChange={e=>setUs(e.target.value)} placeholder="Username" style={IP} required/>
<input type="email" value={se} onChange={e=>setSe(e.target.value)} placeholder="Email" style={IP} required/>
<input type="tel" value={ph} onChange={e=>setPh(e.target.value)} placeholder="Phone Number" style={IP}/>
<input type="text" value={cy} onChange={e=>setCy(e.target.value)} placeholder="Country" style={IP}/>
<input type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="Password" style={IP} required/>
<button type="submit" disabled={ld} className="btn btn-p" style={{width:"100%",padding:14,fontSize:15}}>{ld?"...":"✨ Create Account"}</button>
</form>)}
</div></div></div>}

{pg==="features"&&<div style={{padding:"60px 4%",maxWidth:1000,margin:"0 auto",textAlign:"center"}}>
<h2 className="font-serif" style={{fontSize:36,fontWeight:700,marginBottom:12}}>Premium <span className="text-g">Features</span></h2>
<p className="muted" style={{fontSize:14,marginBottom:40}}>Everything you need to manage your wealth</p>
<div className="g3">{[
{i:"💱",t:"Multi-Currency",d:"10 wallets per user: USD, EUR, GBP, INR, AED, SAR, JPY, CNY, AUD, CAD. All with live exchange rates."},
{i:"🔄",t:"Instant Exchange",d:"Swap between any currencies at live rates. No hidden fees, instant settlement."},
{i:"📤",t:"Global Transfers",d:"Send money to any user instantly. Internal transfers with zero fees."},
{i:"📥",t:"Deposit Methods",d:"Fund via UPI, Bank Transfer, PayPal, Stripe, or Crypto from external wallets."},
{i:"📋",t:"KYC Verification",d:"Secure document upload and verification. Unlock full platform features."},
{i:"🔐",t:"Premium Security",d:"Bank-grade encryption, role-based access, audit logging, and 24/7 monitoring."},
].map(s=>(<div key={s.t} className="card" style={{padding:28,textAlign:"left"}}><div style={{fontSize:36,marginBottom:12}}>{s.i}</div><h3 style={{fontSize:16,fontWeight:600,marginBottom:8}}>{s.t}</h3><p className="muted" style={{fontSize:13,lineHeight:1.7}}>{s.d}</p></div>))}</div></div>}

{pg==="currencies"&&<div style={{padding:"60px 4%",maxWidth:800,margin:"0 auto",textAlign:"center"}}>
<h2 className="font-serif" style={{fontSize:36,fontWeight:700,marginBottom:12}}>Supported <span className="text-g">Currencies</span></h2>
<p className="muted" style={{fontSize:14,marginBottom:40}}>All major world currencies + cryptocurrencies</p>
<div className="g-auto">{["USD","EUR","GBP","INR","AED","SAR","JPY","CNY","AUD","CAD","USDT","BTC","ETH","SOL","BNB"].map(c=>(
<div key={c} className="card" style={{padding:20,textAlign:"center"}}><div style={{fontSize:18,fontWeight:700}}><span className="text-g">{c}</span></div></div>))}</div></div>}

{pg==="about"&&<div style={{padding:"60px 4%",maxWidth:700,margin:"0 auto"}}>
<h2 className="font-serif" style={{fontSize:36,fontWeight:700,marginBottom:20,textAlign:"center"}}>About <span className="text-g">Us</span></h2>
<div className="card" style={{padding:32,lineHeight:1.9,color:"#9ca3af",fontSize:14}}>
<p style={{marginBottom:16}}>Global Gemini Wallet is a premium multi-currency wealth management platform built for the modern world. We combine traditional fiat currencies with digital assets in one seamless, luxurious interface.</p>
<p>With KYC verification, encrypted authentication, admin oversight, and full audit trails, your funds and data remain secure at all times.</p>
</div>
<div className="g4" style={{marginTop:24}}>{[{v:"2025",l:"Founded"},{v:"170+",l:"Currencies"},{v:"100%",l:"Secure"},{v:"24/7",l:"Support"}].map(s=>(<div key={s.l} className="st"><div className="st-v"><span className="text-g">{s.v}</span></div><div className="st-l">{s.l}</div></div>))}</div></div>}
<div style={{borderTop:"1px solid rgba(255,255,255,0.05)",padding:"24px 4%",textAlign:"center",fontSize:12,color:"#4b5563"}}>© 2025 Global Gemini Wallet. All rights reserved.</div>
</div>)}
EOF

echo "✅ Core system built!"

# ─── 8. DASHBOARD ───
cat > app/dashboard/page.tsx << 'DASHBOARD'
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
  const cv=(n:number)=>{const cu=dC;const r=ra[cu]||1;const v=cu==="USD"?n:n*r;return(SYM[cu]||cu)+" "+v.toLocaleString("en-US",{minimumFractionDigits:2})}
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
DASHBOARD

# ─── 9. ADMIN DASHBOARD ───
mkdir -p app/admin/kyc app/admin/deposits app/admin/withdrawals app/admin/users
cat > app/admin/page.tsx << 'EOF'
"use client";import{useState,useEffect}from"react";import Link from "next/link";
export default function AdminPage(){
const[u,setU]=useState<any[]>([]);const[uid,setUid]=useState("");const[cr,setCr]=useState("USD");const[am,setAm]=useState("");const[msg,setMsg]=useState("");const[er,setEr]=useState("");const[sq,setSq]=useState("");const CC=["USD","EUR","GBP","INR","AED","SAR","JPY","CNY","AUD","CAD","USDT","BTC","ETH","SOL"]
useEffect(()=>{fetch("/api/auth/me").then(r=>r.json()).then(d=>{if(d.role!=="ADMIN"){window.location.href="/";return}load()})},[])
const load=()=>fetch("/api/admin/users").then(r=>r.json()).then(d=>setU(d.users||[]))
const fd=async()=>{setMsg("");setEr("");try{const r=await fetch("/api/admin/fund",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:uid,currency:cr,amount:parseFloat(am)})});const d=await r.json();if(!r.ok)throw new Error(d.error);setMsg("✅ Deposited!");setAm("")}catch(e:any){setEr(e.message)}}
const da=async(id:string,a:string)=>{await fetch("/api/admin/user",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:id,action:a})});load()}
const dl=async(id:string)=>{if(!confirm("Delete?"))return;await fetch("/api/admin/user",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:id})});load()}
const filtered=u.filter((x:any)=>x.name?.toLowerCase().includes(sq.toLowerCase())||x.email?.toLowerCase().includes(sq.toLowerCase()))
return(<div className="app"><div className="top"><div className="top-in">
<span style={{fontWeight:700,fontSize:18}}>🌍 Global Gemini <span className="text-g">Wallet</span><span style={{fontSize:10,background:"rgba(255,215,0,0.12)",color:"#FFD700",padding:"2px 8px",borderRadius:100,marginLeft:8}}>ADMIN</span></span>
<div style={{display:"flex",gap:16,alignItems:"center"}}>
<Link href="/admin" className="tab act">💫 Dashboard</Link>
<Link href="/admin/kyc" className="tab">📋 KYC</Link>
<Link href="/admin/deposits" className="tab">📥 Deposits</Link>
<Link href="/admin/withdrawals" className="tab">📤 Withdrawals</Link>
<button onClick={async()=>{await fetch("/api/auth/signout",{method:"POST"});window.location.href="/"}} className="btn btn-s btn-sm">Sign Out</button>
</div></div></div>
<div className="main fi">
<h1 style={{fontSize:26,fontWeight:700,marginBottom:24}}><span className="text-g">⚡ Admin Panel</span></h1>
<div className="g4" style={{marginBottom:24}}>
<div className="st"><div className="st-v" style={{color:"#60a5fa"}}>{u.length}</div><div className="st-l">Users</div></div>
<div className="st"><div className="st-v" style={{color:"#facc15"}}>{u.filter((x:any)=>x.kycStatus==="PENDING").length}</div><div className="st-l">KYC</div></div>
<div className="st"><div className="st-v" style={{color:"#22c55e"}}>{u.filter((x:any)=>x.kycStatus==="VERIFIED").length}</div><div className="st-l">Verified</div></div>
<div className="st"><div className="st-v" style={{color:"#a78bfa"}}>{u.filter((x:any)=>x.status==="ACTIVE").length}</div><div className="st-l">Active</div></div>
</div>
<div className="g2" style={{gap:24}}>
<div className="card" style={{padding:24}}>
<h3 style={{fontSize:16,fontWeight:600,marginBottom:16}}>💫 Fund User</h3>
{msg&&<div className="bg">{msg}</div>}{er&&<div className="br">{er}</div>}
<select value={uid} onChange={e=>setUid(e.target.value)} className="inp" style={{marginBottom:12}} required><option value="">Select user</option>{u.filter((x:any)=>x.role!=="ADMIN").map((x:any)=><option key={x.id} value={x.id}>{x.name} ({x.email})</option>)}</select>
<div style={{display:"flex",gap:8,marginBottom:12}}><select value={cr} onChange={e=>setCr(e.target.value)} className="inp" style={{width:100}}>{CC.map(c=><option key={c} value={c}>{c}</option>)}</select>
<input type="number" step="0.01" value={am} onChange={e=>setAm(e.target.value)} placeholder="Amount" className="inp" style={{flex:1}}/></div>
<button onClick={fd} className="btn btn-p" style={{width:"100%"}}>💫 Deposit</button>
</div>
<div className="card" style={{padding:24}}>
<h3 style={{fontSize:16,fontWeight:600,marginBottom:16}}>👥 Users</h3>
<input type="text" value={sq} onChange={e=>setSq(e.target.value)} placeholder="Search users..." className="inp" style={{marginBottom:12}}/>
<div style={{maxHeight:400,overflowY:"auto"}}>{filtered.map((x:any)=>(<div key={x.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
<div><span style={{fontSize:14,fontWeight:500}}>{x.name}</span><span className="muted text-xs" style={{marginLeft:6}}>{x.email}</span></div>
<div style={{display:"flex",gap:4,alignItems:"center"}}>
<span style={{fontSize:10,padding:"2px 6px",borderRadius:100,color:x.kycStatus==="VERIFIED"?"#22c55e":"#facc15",background:x.kycStatus==="VERIFIED"?"rgba(34,197,94,0.1)":"rgba(250,204,21,0.1)"}}>{x.kycStatus}</span>
{x.status==="FROZEN"?<button onClick={()=>da(x.id,"UNFREEZE")} className="btn btn-s" style={{padding:"3px 8px",fontSize:10}}>Unfreeze</button>:<button onClick={()=>da(x.id,"FREEZE")} className="btn btn-s" style={{padding:"3px 8px",fontSize:10}}>Freeze</button>}
<button onClick={()=>dl(x.id)} style={{padding:"3px 8px",background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:6,color:"#ef4444",fontSize:10,cursor:"pointer"}}>Delete</button>
</div></div>))}</div></div></div></div></div>)
EOF

# ─── 10. WALLET PAGES ───
mkdir -p app/wallet/deposit app/wallet/withdraw app/kyc
cat > app/wallet/deposit/page.tsx << 'EOF'
"use client";import{useState}from"react";import Link from "next/link";
const A={"BTC":"14J6KfQzXyLV8gLUKMWch2S3hjJvkMy5Rc","USDT-ERC20":"0xa7b97439665f545adb3bbc431ceb5053d4b46f49","USDT-BEP20":"0xa7b97439665f545adb3bbc431ceb5053d4b46f49","USDT-TRC20":"TLgjfeg8Mqw5ueo1CGC8eTb4EHysPMMA6S","SOL":"FQy4HArVdBbZ87AHrbfdhSXRgyE5NUbrh6GaL8enMUeh","ETH":"0x09B0E6D01fb1DeDf172933cC1673aAf460353AAD"}
export default function Page(){const[as,setAs]=useState("BTC");const[st,setSt]=useState<"form"|"done">("form")
if(st==="done")return(<div className="app" style={{alignItems:"center",justifyContent:"center",padding:20}}><div className="card" style={{padding:32,maxWidth:440,width:"100%",textAlign:"center"}}>
<div style={{fontSize:48,marginBottom:12}}>📥</div><h2 className="font-serif" style={{fontSize:20,fontWeight:700,marginBottom:16}}>Deposit {as}</h2>
<div style={{background:"rgba(255,215,0,0.06)",border:"1px solid rgba(255,215,0,0.15)",borderRadius:12,padding:16,marginBottom:16,wordBreak:"break-all",fontSize:12,fontFamily:"monospace",color:"#FFD700"}}>{A[as]||"N/A"}</div>
<div className="br" style={{marginBottom:16}}>⚠️ Send only {as} to this address</div>
<p style={{color:"#facc15",fontSize:12,marginBottom:16}}>⏳ Notify admin after sending</p>
<Link href="/dashboard" className="btn btn-p">Dashboard</Link></div></div>)
return(<div className="app" style={{padding:"24px 4%"}}><div style={{maxWidth:500,margin:"0 auto"}}>
<Link href="/dashboard" className="muted" style={{fontSize:13,textDecoration:"none"}}>← Dashboard</Link>
<h1 className="font-serif" style={{fontSize:24,fontWeight:700,margin:"16px 0 24px"}}>📥 Deposit</h1>
<div className="card" style={{padding:24}}>
<label className="muted text-xs">Select Asset</label>
<select value={as} onChange={e=>setAs(e.target.value)} className="inp" style={{margin:"8px 0 20px"}}><option>BTC</option><option>ETH</option><option>SOL</option><option>USDT</option></select>
<button onClick={()=>setSt("done")} className="btn btn-p" style={{width:"100%"}}>Get Address</button>
</div></div></div>)}
EOF

cat > app/wallet/withdraw/page.tsx << 'EOF'
"use client";import{useState}from"react";import Link from "next/link";
export default function Page(){const[m,setM]=useState("UPI");const[c,setC]=useState("USD");const[a,setA]=useState("");const[d,setD]=useState<Record<string,string>>({});const[st,setSt]=useState<"form"|"done">("form")
if(st==="done")return(<div className="app" style={{alignItems:"center",justifyContent:"center",padding:20}}><div className="card" style={{padding:32,maxWidth:400,textAlign:"center"}}>
<div style={{fontSize:48,marginBottom:12}}>📤</div><h2 className="font-serif" style={{fontSize:20,fontWeight:700,marginBottom:12}}>Submitted</h2>
<p style={{color:"#facc15",fontSize:12,marginBottom:16}}>⏳ Pending approval</p>
<Link href="/dashboard" className="btn btn-p">Dashboard</Link></div></div>)
const mt=[{id:"UPI",f:[{k:"upi",pl:"UPI ID"}]},{id:"BANK",f:[{k:"name",pl:"Name"},{k:"acc",pl:"Account"},{k:"ifsc",pl:"IFSC"}]},{id:"PAYPAL",f:[{k:"em",pl:"Email"}]},{id:"CRYPTO",f:[{k:"addr",pl:"Address"},{k:"net",pl:"Network"}]}]
return(<div className="app" style={{padding:"24px 4%"}}><div style={{maxWidth:500,margin:"0 auto"}}>
<Link href="/dashboard" className="muted" style={{fontSize:13,textDecoration:"none"}}>← Dashboard</Link>
<h1 className="font-serif" style={{fontSize:24,fontWeight:700,margin:"16px 0 24px"}}>📤 Withdraw</h1>
<div className="card" style={{padding:24}}>
<div className="g-auto" style={{marginBottom:16,gap:8}}>{mt.map(x=>(<button key={x.id} onClick={()=>{setM(x.id);setD({})}} style={{padding:12,borderRadius:10,border:m===x.id?"2px solid #FFD700":"1px solid rgba(255,255,255,0.08)",background:m===x.id?"rgba(255,215,0,0.1)":"rgba(255,255,255,0.03)",color:"#fff",cursor:"pointer",fontSize:12,textAlign:"center"}}>{x.id}</button>))}</div>
<div style={{display:"flex",gap:8,marginBottom:16}}><select value={c} onChange={e=>setC(e.target.value)} className="inp" style={{width:100}}><option>USD</option><option>EUR</option><option>GBP</option><option>USDT</option></select>
<input type="number" step="0.01" value={a} onChange={e=>setA(e.target.value)} placeholder="Amount" className="inp" style={{flex:1}}/></div>
{mt.find(x=>x.id===m)?.f.map(x=>(<input key={x.k} type="text" value={d[x.k]||""} onChange={e=>setD({...d,[x.k]:e.target.value})} placeholder={x.pl} className="inp" style={{marginBottom:8}}/>))}
<button onClick={()=>setSt("done")} className="btn btn-p" style={{width:"100%",marginTop:8}}>Submit</button>
</div></div></div>)}
EOF

# ─── 11. PUSH ───
npx prisma generate 2>/dev/null
npx prisma db push 2>/dev/null
npx tsx prisma/seed.ts 2>/dev/null
git add -A && git commit -m "Complete luxury fintech rebuild" && git push
echo "✅ COMPLETE! Deployed to Vercel."
echo "🔑 Admin: admin@globalgemini.com / Admin@123456"
