import { NextResponse } from "next/server"; import { prisma } from "@/lib/db"; import { hashPassword } from "@/lib/auth";
export async function POST(req: Request) {
  try {
    const { email, username, name, password } = await req.json();
    if (!email || !username || !name || !password) return NextResponse.json({ error: "All fields required" }, { status: 400 });
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) return NextResponse.json({ error: "Username taken" }, { status: 409 });
    
    const hashed = await hashPassword(password);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    await prisma.user.create({
      data: { email, username, name, password: hashed, verifyToken: otp, wallet: { create: {} } },
    });

    // Create default USD balance + crypto balances
    const user = await prisma.user.findUnique({ where: { email }, include: { wallet: true } });
    if (user?.wallet) {
      await prisma.balance.createMany({
        data: [
          { walletId: user.wallet.id, currency: "USD", amount: 0 },
          { walletId: user.wallet.id, currency: "USDT", amount: 0 },
          { walletId: user.wallet.id, currency: "BTC", amount: 0 },
          { walletId: user.wallet.id, currency: "ETH", amount: 0 },
          { walletId: user.wallet.id, currency: "SOL", amount: 0 },
        ],
      });
    }

    // Send OTP email (requires RESEND_API_KEY)
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST", headers: { "Authorization": `Bearer ${resendApiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: "Global Gemini Wallet <verify@globalgeminiwallet.com>",
            to: email, subject: "Verify your email",
            html: `<div style="font-family:Inter,sans-serif;background:#0a0a0f;padding:32px"><div style="max-width:400px;margin:0 auto;background:rgba(255,255,255,0.05);border-radius:16px;padding:24px;text-align:center"><h1 style="color:#d4af37;font-size:20px">Global Gemini Wallet</h1><p style="color:#9ca3af;font-size:14px;margin:16px 0">Your verification code:</p><div style="font-size:36px;font-weight:bold;color:#fff;letter-spacing:8px;background:rgba(212,175,55,0.1);border-radius:12px;padding:16px">${otp}</div><p style="color:#6b7280;font-size:12px;margin-top:16px">Enter this code to verify your email.</p></div></div>`,
          }),
        });
      } catch (e) { console.log("Email send failed (optional)"); }
    } else {
      console.log(`📧 No RESEND_API_KEY. OTP for ${email}: ${otp}`);
    }

    return NextResponse.json({ success: true, message: "Account created! Check your email for verification code.", requiresVerification: true });
  } catch (e: any) {
    if (e.code === "P2002") return NextResponse.json({ error: "Email or username already exists" }, { status: 409 });
    console.error(e); return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
