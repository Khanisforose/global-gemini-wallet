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

    const resendApiKey = process.env.RESEND_API_KEY;
    let emailSent = false;
    if (resendApiKey) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Authorization": `Bearer ${resendApiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: "Global Gemini Wallet <onboarding@resend.dev>",
            to: email,
            subject: "Verify your email - Global Gemini Wallet",
            html: `<div style="font-family:Inter,sans-serif;background:#0a0a0f;padding:32px"><div style="max-width:400px;margin:0 auto;background:rgba(255,255,255,0.05);border-radius:16px;padding:24px;text-align:center"><h1 style="color:#d4af37;font-family:Georgia,serif">Global Gemini Wallet</h1><p style="color:#9ca3af;font-size:14px;margin:16px 0">Your verification code:</p><div style="font-size:36px;font-weight:bold;color:#fff;letter-spacing:8px;background:rgba(212,175,55,0.1);border-radius:12px;padding:16px">${otp}</div><p style="color:#6b7280;font-size:12px;margin-top:16px">Enter this code to verify your email and access your wallet.</p></div></div>`,
          }),
        });
        emailSent = true;
      } catch (e) { console.log("Email send failed", e); }
    }

    return NextResponse.json({
      success: true,
      message: emailSent ? "✅ Verification code sent to your email!" : `📧 Dev mode - Your code: ${otp}`,
      requiresVerification: true,
      devOtp: emailSent ? undefined : otp,
    });
  } catch (e: any) {
    if (e.code === "P2002") return NextResponse.json({ error: "Email or username already exists" }, { status: 409 });
    console.error(e); return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
