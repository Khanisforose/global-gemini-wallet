"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const FIAT_SYMBOLS: Record<string, string> = {
  USD: "$", EUR: "€", GBP: "£", JPY: "¥", CHF: "CHF", CAD: "C$", AUD: "A$", CNY: "¥",
  INR: "₹", BRL: "R$", KRW: "₩", SEK: "kr", NOK: "kr", TRY: "₺", AED: "د.إ", SAR: "﷼",
};
const CRYPTO_ICONS: Record<string, string> = { BTC: "₿", ETH: "⟠", SOL: "◎", USDC: "$" };

export default function Dashboard() {
  const r = useRouter();
  const [user, setU] = useState<any>(null);
  const [fiatBal, setFB] = useState<any[]>([]);
  const [cryptoBal, setCB] = useState<any[]>([]);
  const [totalUSD, setTot] = useState(0);
  const [txs, setTxs] = useState<any[]>([]);
  const [kycStatus, setKyc] = useState("UNVERIFIED");

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (!d.id) { r.push("/"); return; }
      setU(d);
      setKyc(d.kycStatus || "UNVERIFIED");
    });
    fetch("/api/balances").then(r => r.json()).then(d => {
      setFB(d.balances || []);
      setTot(d.totalUSD || 0);
    });
    fetch("/api/transactions").then(r => r.json()).then(d => setTxs(d.transactions || []));
    fetch("/api/crypto/balances").then(r => r.json()).then(d => {
      if (d.balances) { setCB(d.balances); setTot((t: number) => t + (d.totalUSD || 0)); }
    }).catch(() => {});
  }, [r]);

  if (!user) return <div className="min-h-screen flex items-center justify-center"><div className="w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" /></div>;

  const formatUSD = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 bg-[var(--bg-primary)]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-serif font-semibold text-lg">Global Gemini <span className="gold-text">Wallet</span></span>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">{user.name}</span>
            <button onClick={async () => { await fetch("/api/auth/signout", { method: "POST" }); r.push("/"); }} className="text-sm text-gray-500 hover:text-white">Sign Out</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome + Total */}
        <div className="mb-6">
          <h1 className="text-2xl font-serif font-bold">Welcome, {user.name}</h1>
          <p className="text-3xl font-bold gold-text mt-2">{formatUSD(totalUSD)} <span className="text-sm text-gray-500 font-normal">total USD</span></p>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {kycStatus !== "VERIFIED" && (
            <Link href="/kyc" className={`btn-${kycStatus === "PENDING" ? "secondary" : "primary"} text-sm`}>
              {kycStatus === "PENDING" ? "⏳ KYC Pending" : "📋 Complete KYC"}
            </Link>
          )}
          {kycStatus === "VERIFIED" && (
            <>
              <Link href="/wallet/deposit" className="btn-primary text-sm">📥 Deposit</Link>
              <Link href="/wallet/withdraw" className="btn-secondary text-sm">📤 Withdraw</Link>
            </>
          )}
        </div>

        {/* Fiat Balances */}
        <div className="glass p-5 mb-6">
          <h2 className="text-lg font-serif font-semibold mb-4">💵 Fiat Currencies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {fiatBal.map((b: any, i: number) => (
              <div key={b.currency} className="bg-white/5 rounded-xl p-3 flex justify-between items-center">
                <div>
                  <span className="text-sm font-medium">{b.currency}</span>
                  <p className="text-lg font-semibold font-serif">{FIAT_SYMBOLS[b.currency] || b.currency}{b.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500">USD</span>
                  <p className="text-sm gold-text font-medium">{formatUSD(b.usdValue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Crypto Balances */}
        <div className="glass p-5 mb-6">
          <h2 className="text-lg font-serif font-semibold mb-4">🪙 Crypto</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {cryptoBal.length === 0 ? (
              <p className="text-gray-500 text-sm col-span-3">
                No crypto wallets linked. <Link href="/wallet/crypto" className="text-gold-400 hover:text-gold-300">Link a wallet</Link>
              </p>
            ) : cryptoBal.map((b: any, i: number) => (
              <div key={b.symbol} className="bg-white/5 rounded-xl p-3 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{CRYPTO_ICONS[b.symbol] || "₿"}</span>
                    <span className="text-sm font-medium">{b.symbol}</span>
                    <span className="text-xs text-gray-500">{b.chain}</span>
                  </div>
                  <p className="text-lg font-semibold font-serif">{b.balance.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 6 })}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500">USD</span>
                  <p className="text-sm gold-text font-medium">{formatUSD(b.usdValue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transactions */}
        <div className="glass p-5">
          <h2 className="text-lg font-serif font-semibold mb-4">📋 Recent Transactions</h2>
          {txs.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">No transactions yet</p>
          ) : (
            <div className="divide-y divide-white/5">
              {txs.slice(0, 15).map((tx: any) => (
                <div key={tx.id} className="flex justify-between py-2">
                  <div>
                    <span className={`text-xs font-medium ${tx.type === "ADMIN_FUNDING" || tx.type === "DEPOSIT" ? "text-green-400" : "text-gold-400"}`}>
                      {tx.type === "ADMIN_FUNDING" ? "Funding" : tx.type === "DEPOSIT" ? "Deposit" : tx.type === "EXCHANGE" ? "Swap" : tx.type}
                    </span>
                    {tx.description && <p className="text-xs text-gray-600">{tx.description}</p>}
                  </div>
                  <div className="text-right">
                    <span className={`text-sm ${tx.type === "ADMIN_FUNDING" || tx.type === "DEPOSIT" ? "text-green-400" : "text-gold-400"}`}>
                      +{Number(tx.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })} {tx.currency}
                    </span>
                    <p className="text-xs text-gray-600">{new Date(tx.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
