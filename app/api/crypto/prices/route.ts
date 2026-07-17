import { NextResponse } from "next/server";

let cache: { data: any; ts: number } | null = null;

export async function GET() {
  if (cache && Date.now() - cache.ts < 60000) return NextResponse.json(cache.data);
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin,tether,usd-coin&vs_currencies=usd");
    const data = await res.json();
    const prices = {
      BTC: data.bitcoin?.usd || 67000,
      ETH: data.ethereum?.usd || 3400,
      SOL: data.solana?.usd || 145,
      BNB: data.binancecoin?.usd || 580,
      USDT: data.tether?.usd || 1,
      USDC: data["usd-coin"]?.usd || 1,
    };
    cache = { data: prices, ts: Date.now() };
    return NextResponse.json(prices);
  } catch {
    return NextResponse.json({ BTC: 67000, ETH: 3400, SOL: 145, BNB: 580, USDT: 1, USDC: 1 });
  }
}
