import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const p = new PrismaClient();

async function main() {
  const FIAT = ["USD", "EUR", "GBP", "INR", "AED", "SAR", "JPY", "CNY", "AUD", "CAD"];
  const ALL = [...FIAT, "USDT", "BTC", "ETH", "SOL", "BNB"];

  const pw = await bcrypt.hash("Admin@123456", 12);
  const admin = await p.user.upsert({
    where: { email: "admin@globalgemini.com" },
    update: {},
    create: { email: "admin@globalgemini.com", username: "admin", name: "Admin", password: pw, role: "ADMIN", kycStatus: "VERIFIED" },
  });

  for (const c of ALL) {
    await p.wallet.upsert({
      where: { userId_currency: { userId: admin.id, currency: c } },
      update: { balance: 1000000 },
      create: { userId: admin.id, currency: c, balance: 1000000 },
    });
  }

  const rates: Record<string, number> = {
    USD: 1, EUR: 0.92, GBP: 0.79, INR: 83.5, AED: 3.67, SAR: 3.75,
    JPY: 149.5, CNY: 7.24, AUD: 1.54, CAD: 1.36, USDT: 1, BTC: 0.000015,
    ETH: 0.00029, SOL: 0.0069, BNB: 0.0017,
  };

  for (const [to, rate] of Object.entries(rates)) {
    await p.exchangeRate.upsert({
      where: { from_to: { from: "USD", to } },
      update: { rate },
      create: { from: "USD", to, rate },
    });
  }

  console.log("✅ Seeded admin@globalgemini.com / Admin@123456");
}
main().catch(console.error).finally(() => p.$disconnect());
