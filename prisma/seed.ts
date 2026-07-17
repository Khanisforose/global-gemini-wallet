import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const p = new PrismaClient();
async function main() {
  const pw = await bcrypt.hash("Admin@123456", 12);
  await p.user.upsert({
    where: { email: "admin@globalgemini.com" },
    update: {},
    create: { email: "admin@globalgemini.com", username: "admin", name: "Admin", password: pw, role: "ADMIN", kycStatus: "VERIFIED", emailVerified: true, wallet: { create: {} } },
  });
  const w = await p.wallet.findFirst();
  if (w) {
    for (const c of ["USD", "EUR", "GBP", "JPY", "CHF", "CAD", "AUD", "CNY", "INR", "BRL", "MXN"]) {
      await p.balance.upsert({ where: { walletId_currency: { walletId: w.id, currency: c } }, update: {}, create: { walletId: w.id, currency: c, amount: 1000000 } });
    }
  }
  const rates = [
    ["USD", 1], ["EUR", 0.92], ["GBP", 0.79], ["JPY", 149.5], ["CHF", 0.88], ["CAD", 1.36], ["AUD", 1.54],
    ["CNY", 7.24], ["INR", 83.5], ["BRL", 5.05], ["MXN", 17.8], ["SGD", 1.34], ["NZD", 1.64], ["KRW", 1330],
    ["SEK", 10.45], ["NOK", 10.7], ["DKK", 6.88], ["TRY", 30.2], ["AED", 3.67], ["SAR", 3.75], ["HKD", 7.82],
    ["THB", 35.8], ["ZAR", 18.9], ["PLN", 4.02], ["RON", 4.57], ["HUF", 358], ["CZK", 22.8], ["ILS", 3.68],
    ["CLP", 975], ["PHP", 56.2], ["IDR", 15700], ["MYR", 4.72], ["VND", 24600], ["NGN", 1550], ["EGP", 30.9],
    ["KES", 157], ["COP", 3925], ["ARS", 820], ["UAH", 38.2], ["QAR", 3.64], ["OMR", 0.385], ["BHD", 0.376],
    ["KWD", 0.307], ["JOD", 0.709], ["TWD", 31.8], ["MAD", 10.05], ["PKR", 278], ["BDT", 109.5], ["LBP", 89500],
  ];
  for (const [t, r] of rates) {
    await p.exchangeRate.upsert({
      where: { baseCurrency_targetCurrency: { baseCurrency: "USD", targetCurrency: t as string } },
      update: { rate: r },
      create: { baseCurrency: "USD", targetCurrency: t as string, rate: r },
    });
  }
  console.log("✅ Seeded: admin@globalgemini.com / admin / Admin@123456");
}
main().catch(console.error).finally(() => p.$disconnect());
