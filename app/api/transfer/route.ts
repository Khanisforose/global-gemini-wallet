import { NextResponse } from "next/server"; import { prisma } from "@/lib/db"; import { getSession } from "@/lib/auth";
export async function POST(req: Request) {
  try {
    const s = await getSession(); if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { to, currency, amount } = await req.json();
    if (!to || !amount || amount <= 0) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    
    // Find recipient by email OR username
    const recipient = await prisma.user.findFirst({
      where: { OR: [{ email: to }, { username: to }] },
      include: { wallet: true },
    });
    if (!recipient || !recipient.wallet) return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (recipient.id === s.userId) return NextResponse.json({ error: "Cannot send to yourself" }, { status: 400 });
    
    const sender = await prisma.user.findUnique({
      where: { id: s.userId },
      include: { wallet: { include: { balances: { where: { currency } } } } },
    });
    if (!sender?.wallet) return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    
    const fromBal = sender.wallet.balances[0];
    if (!fromBal || Number(fromBal.amount) < amount) return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    
    await prisma.$transaction(async (tx) => {
      await tx.balance.update({ where: { walletId_currency: { walletId: sender.wallet!.id, currency } }, data: { amount: { decrement: amount } } });
      await tx.balance.upsert({ where: { walletId_currency: { walletId: recipient.wallet!.id, currency } }, update: { amount: { increment: amount } }, create: { walletId: recipient.wallet!.id, currency, amount } });
      await tx.transaction.create({ data: { walletId: sender.wallet!.id, type: "TRANSFER", amount, currency, description: `Sent to ${recipient.username || recipient.email}` } });
      await tx.transaction.create({ data: { walletId: recipient.wallet!.id, type: "DEPOSIT", amount, currency, description: `Received from ${sender.username || sender.email}` } });
    });
    return NextResponse.json({ success: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
