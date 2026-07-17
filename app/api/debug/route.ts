import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
    const users = await prisma.user.findMany({
      select: { email: true, role: true, kycStatus: true, kycFullName: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
    return NextResponse.json({ users });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}
