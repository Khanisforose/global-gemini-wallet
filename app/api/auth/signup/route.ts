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
    const user = await prisma.user.create({
      data: { email, username, name, password: hashed, wallet: { create: {} } },
      include: { wallet: true },
    });
    
    if (user.wallet) {
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

    return NextResponse.json({ success: true, message: "Account created! Please sign in." });
  } catch (e: any) {
    if (e.code === "P2002") return NextResponse.json({ error: "Email or username already exists" }, { status: 409 });
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
