import { NextResponse } from "next/server"; import { prisma } from "@/lib/db"; import { getSession } from "@/lib/auth";

const ALL_FIAT = ["USD","EUR","GBP","JPY","CHF","CAD","AUD","CNY","INR","BRL","MXN","SGD","NZD","KRW","SEK","NOK","DKK","TRY","AED","SAR","HKD","THB","ZAR","PLN","RON","HUF","CZK","ILS","CLP","PHP","IDR","MYR","VND","NGN","EGP","KES","COP","ARS","UAH","QAR","OMR","BHD","KWD","JOD","TWD","MAD","PKR","BDT","LBP"];

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

    // Show ALL fiat currencies (even with 0 balance)
    const fiat = ALL_FIAT.map(code => {
      const bal = w.balances.find(b => b.currency === code);
      const amount = bal ? Number(bal.amount) : 0;
      const rate = rm.get(code) || 1;
      const usdValue = code === "USD" ? amount : amount / rate;
      totalUSD += usdValue;
      return { currency: code, amount, usdValue };
    }).filter(b => b.amount > 0 || ["USD","EUR","GBP","JPY","CHF","CAD","AUD","CNY","INR"].includes(b.currency));

    const crypto = ["BTC","ETH","SOL","USDT"].map(code => {
      const bal = w.balances.find(b => b.currency === code);
      const amount = bal ? Number(bal.amount) : 0;
      const price = cryptoPrices[code] || 0;
      const usdValue = amount * price;
      totalUSD += usdValue;
      return { symbol: code, amount, usdValue, price };
    }).filter(c => c.amount > 0);

    return NextResponse.json({ balances: fiat, crypto, totalUSD });
  } catch { return NextResponse.json({ error: "Error" }, { status: 500 }); }
}
