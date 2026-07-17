import { NextResponse } from "next/server"; import { prisma } from "@/lib/db"; import { getSession } from "@/lib/auth";
export async function GET() {
  try {
    const s = await getSession(); if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const w = await prisma.wallet.findUnique({ where: { userId: s.userId }, include: { balances: true } });
    if (!w) return NextResponse.json({ balances: [], crypto: [], totalUSD: 0 });
    
    // Get fiat rates
    const rates = await prisma.exchangeRate.findMany({ where: { baseCurrency: "USD" } });
    const rm = new Map(rates.map(r => [r.targetCurrency, Number(r.rate)]));
    
    // Get crypto prices
    let cryptoPrices: Record<string, number> = {};
    try {
      const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,tether&vs_currencies=usd");
      const d = await res.json();
      cryptoPrices = { BTC: d.bitcoin?.usd || 67000, ETH: d.ethereum?.usd || 3400, SOL: d.solana?.usd || 145, USDT: d.tether?.usd || 1 };
    } catch { cryptoPrices = { BTC: 67000, ETH: 3400, SOL: 145, USDT: 1 }; }
    
    let totalUSD = 0;
    const fiat = w.balances.filter(b => ["USD","EUR","GBP","JPY","CHF","CAD","AUD","CNY","INR","BRL","MXN","SGD","NZD","KRW","SEK","TRY","AED"].includes(b.currency))
      .map(b => { const r = rm.get(b.currency) || 1; const u = b.currency === "USD" ? Number(b.amount) : Number(b.amount) / r; totalUSD += u; return { currency: b.currency, amount: Number(b.amount), usdValue: u }; });
    
    const crypto = w.balances.filter(b => ["BTC","ETH","SOL","USDT"].includes(b.currency))
      .map(b => { const usd = Number(b.amount) * (cryptoPrices[b.currency] || 1); totalUSD += usd; return { symbol: b.currency, amount: Number(b.amount), usdValue: usd, price: cryptoPrices[b.currency] || 0 }; });
    
    return NextResponse.json({ balances: fiat, crypto, totalUSD });
  } catch { return NextResponse.json({ error: "Error" }, { status: 500 }); }
}
