import { NextResponse } from "next/server"; import { prisma } from "@/lib/db"; import { getSession } from "@/lib/auth";
export async function GET() {
  try {
    const s = await getSession(); if (!s) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const u = await prisma.user.findUnique({ where: { id: s.userId }, select: { id: true, email: true, username: true, name: true, role: true, kycStatus: true } });
    if (!u) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(u);
  } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
}
