import { NextResponse } from "next/server"; import { prisma } from "@/lib/db"; import { getSession } from "@/lib/auth";
export async function POST(req: Request) {
  try { const s = await getSession(); if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { toEmail, currency, amount, note } = await req.json();
    if (!toEmail || !amount || amount <= 0) return NextResponse.json({ error: "Invalid" }, { status: 400 });
    const fromUser = await prisma.user.findUnique({ where: { id: s.userId }, include: { wallet: { include: { balances: { where: { currency } } } } } });
    const toUser = await prisma.user.findUnique({ where: { email: toEmail }, include: { wallet: true } });
    if (!fromUser?.wallet || !toUser?.wallet) return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    const fromBal = fromUser.wallet.balances[0];
    if (!fromBal || Number(fromBal.amount) < amount) return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    await prisma.$transaction(async (tx) => {
      await tx.balance.update({ where: { walletId_currency: { walletId: fromUser.wallet!.id, currency } }, data: { amount: { decrement: amount } } });
      await tx.balance.upsert({ where: { walletId_currency: { walletId: toUser.wallet!.id, currency } }, update: { amount: { increment: amount } }, create: { walletId: toUser.wallet!.id, currency, amount } });
      await tx.transaction.create({ data: { walletId: fromUser.wallet!.id, type: "TRANSFER", amount, currency, description: `Sent to ${toEmail}${note ? ": " + note : ""}` } });
      await tx.transaction.create({ data: { walletId: toUser.wallet!.id, type: "DEPOSIT", amount, currency, description: `Received from ${fromUser.email}${note ? ": " + note : ""}` } });
    });
    return NextResponse.json({ success: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
