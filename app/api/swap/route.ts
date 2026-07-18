import { NextResponse } from "next/server"; import { prisma } from "@/lib/db"; import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const s = await getSession(); if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { from, to, amount } = await req.json();
    if (!amount || amount <= 0) return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    if (from === to) return NextResponse.json({ error: "Cannot swap same currency" }, { status: 400 });
    
    const user = await prisma.user.findUnique({
      where: { id: s.userId },
      include: { wallet: { include: { balances: true } } },
    });
    if (!user?.wallet) return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    
    const fromBal = user.wallet.balances.find(b => b.currency === from);
    if (!fromBal || Number(fromBal.amount) < amount) return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    
    // Get crypto prices for conversion
    let cryptoPrices: Record<string, number> = { BTC: 67000, ETH: 3400, SOL: 145, USDT: 1 };
    try {
      const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,tether&vs_currencies=usd");
      const d = await res.json();
      cryptoPrices = { BTC: d.bitcoin?.usd || 67000, ETH: d.ethereum?.usd || 3400, SOL: d.solana?.usd || 145, USDT: d.tether?.usd || 1 };
    } catch {}
    
    // Calculate received amount
    let fromInUSD = from === "USD" ? amount : amount * (cryptoPrices[from] || 0);
    let received = to === "USD" ? fromInUSD : fromInUSD / (cryptoPrices[to] || 1);
    
    await prisma.$transaction(async (tx) => {
      await tx.balance.update({
        where: { walletId_currency: { walletId: user.wallet!.id, currency: from } },
        data: { amount: { decrement: amount } },
      });
      await tx.balance.upsert({
        where: { walletId_currency: { walletId: user.wallet!.id, currency: to } },
        update: { amount: { increment: received } },
        create: { walletId: user.wallet!.id, currency: to, amount: received },
      });
      await tx.transaction.create({
        data: { walletId: user.wallet!.id, type: "EXCHANGE", amount, currency: from, description: `Swapped to ${to}` },
      });
    });
    
    return NextResponse.json({ success: true, from, to, amount, received: Math.round(received * 100) / 100 });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
