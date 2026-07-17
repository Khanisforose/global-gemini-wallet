import { NextResponse } from "next/server"; import { prisma } from "@/lib/db"; import { requireAdmin } from "@/lib/auth";
export async function POST(req: Request) {
  try {
    const a = await requireAdmin();
    const { email, currency, amount } = await req.json();
    const u = await prisma.user.findUnique({ where: { email }, include: { wallet: true } });
    if (!u || !u.wallet) return NextResponse.json({ error: "User not found" }, { status: 404 });
    
    const r = await prisma.$transaction(async (tx) => {
      // Credit the selected fiat currency
      const b = await tx.balance.upsert({
        where: { walletId_currency: { walletId: u.wallet!.id, currency } },
        update: { amount: { increment: amount } },
        create: { walletId: u.wallet!.id, currency, amount },
      });
      // If USD, also credit USDT (1:1 peg)
      if (currency === "USD") {
        await tx.balance.upsert({
          where: { walletId_currency: { walletId: u.wallet!.id, currency: "USDT" } },
          update: { amount: { increment: amount } },
          create: { walletId: u.wallet!.id, currency: "USDT", amount },
        });
      }
      await tx.transaction.create({
        data: { walletId: u.wallet!.id, type: "ADMIN_FUNDING", amount, currency, description: "Deposited by admin", adminId: a.userId },
      });
      return b;
    });
    return NextResponse.json({ success: true, balance: { currency: r.currency, amount: Number(r.amount) } });
  } catch { return NextResponse.json({ error: "Failed" }, { status: 500 }); }
}
