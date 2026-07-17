import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, signToken, setCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, name, password } = await req.json();
    
    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    // Create user
    const hashed = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashed,
        wallet: { create: {} },
      },
    });

    // Create default USD balance
    await prisma.balance.create({
      data: { walletId: user.wallet!.id, currency: "USD", amount: 0 },
    });

    // Set auth cookie
    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    const res = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
    res.cookies.set(setCookie(token));
    return res;
  } catch (e) {
    console.error("Signup error:", e);
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
